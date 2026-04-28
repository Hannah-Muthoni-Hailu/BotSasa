import bcrypt
bcrypt.__about__ = bcrypt

import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from enum import Enum
from dotenv import load_dotenv
from bson import json_util
import json
import re
import secrets
import hashlib
from huggingface_hub import InferenceClient

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection setup
uri = os.getenv('MONGO_URI')
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['db_auth']
users_collection = db["users"]
projects_collection = db["projects"]

# Password hashing
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# JWT authentication secret key
SECRET_KEY = os.getenv('SECRET_KEY') # Generated using Python's secrets library

# Inference client
client = InferenceClient(
    provider="hf-inference",
    api_key=os.getenv("HF_TOKEN")
)

class ProjectType(str, Enum):
    PAID = "paid"
    FREE = "free"

class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Projects(BaseModel):
    token: str
    projectName: str
    projectType: ProjectType
    projectDetails: str

class NewProject(BaseModel):
    token: str
    oldProjectName: str
    newProjectName: str
    newProjectContext: str

class DeleteProject(BaseModel):
    token: str
    deleteProjectName: str

class TokenRequest(BaseModel):
    token: str

class Chat(BaseModel):
    apikey: str
    text: str

# Utilities
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def validate_password(password: str) -> bool:
    pattern = r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$"

    return bool(re.match(pattern, password))

def validate_username(username: str) -> bool:
    pattern = r'^[A-Za-z0-9@. ]{3,30}$'

    return bool(re.match(pattern, username))

def validate_context(context: str) -> bool:
    pattern = r'^[A-Za-z0-9@. ]$'

    return bool(re.match(pattern, context))

# API key for chatbot use
def create_api_key(user_email, project_name, prefix="mybot_"):
    random_secret = secrets.token_urlsafe(32)
    full_key = f"{prefix}{random_secret}_{user_email}_{project_name}"
    key_hash = hash_api_key(full_key)

    return full_key, key_hash

def hash_api_key(key):
    return hashlib.sha256(key.encode()).hexdigest()

def verify_key(user_key, db_key):
    user_hash = hashlib.sha256(user_key.encode()).hexdigest()
    return secrets.compare_digest(user_hash, db_key)

# Signup
@app.post("/signup")
def signup(user: UserSignup):
    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    if not validate_username(user.username): # Will also validate project name
        raise HTTPException(status_code=400, detail="Username must only contain letters or numbers")
    
    if not validate_password(user.password):
        raise HTTPException(status_code=400, detail="Password must be 6 to 20 characters long and contain letters, numbers and a special symbol(@$!%*#?&)")
    
    
    hashed_pw = hash_password(user.password)
    users_collection.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_pw
    })

    payload = {
        'email': user.email,
        'exp': datetime.now(timezone.utc) + timedelta(seconds=3600)
    }
    
    jwt_token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    # Return all the user's projects so they can be displayed on the dashboard
    cursor = projects_collection.find({ "email": payload["email"] }, {"apikey": 0, "email": 0})
    projects = json.loads(json_util.dumps(list(cursor)))
    
    return {"message": "Signup successful!", "token": jwt_token, "projects": projects}

@app.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Email not registered")
    
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Wrong password. Try again!")
    
    payload = {
        'email': user.email,
        'exp': datetime.now(timezone.utc) + timedelta(seconds=3600)
    }
    
    jwt_token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    cursor = projects_collection.find({ "email": payload["email"] }, {"apikey": 0, "email": 0})
    projects = json.loads(json_util.dumps(list(cursor)))
    
    return {"message": "Login successful!", "token": jwt_token, "projects": projects}

@app.post('/new-project')
def create_project(project: Projects):
    try:
        token = project.token.split(" ")[0]
        payload = jwt.decode(token, SECRET_KEY, algorithms="HS256")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"An internal server error occurred: {str(e)}")

    if not validate_username(project.projectName):
        raise HTTPException(status_code=400, detail="Project name must only contain letters or numbers")
    
    # Ensure a user cannot create multiple projects with the same name
    existing_project = projects_collection.find_one({"email": payload["email"], "projectName": project.projectName})

    if existing_project:
        print("Project with that name already exists")
        raise HTTPException(status_code=400, detail="You have already created a project with that name")
    
    display_once, hash_key = create_api_key(payload["email"], project.projectName)
    
    projects_collection.insert_one({
        "email": payload["email"],
        "projectName": project.projectName,
        "quotaLimit": 20 if project.projectType == "free" else None, # free tier has a quota limit of 20 messages
        "endBillingCycle": datetime.now(timezone.utc) + timedelta(days=28), # billing cycle lasts 28 days
        "quotaUsage": 0, # Tracks the number of messages used up
        "context": project.projectDetails, # Stores the context for the model
        "apikey": hash_key
    })

    cursor = projects_collection.find({ "email": payload["email"] }, {"apikey": 0, "email": 0})
    projects = json.loads(json_util.dumps(list(cursor)))

    return {"message": "Project created successfully", "token": token, "projects": projects, "api_key": display_once}

@app.post("/edit-project")
def edit_project(project: NewProject):
    # Look for the email and old project name combination (get email from token, the fuck)
    try:
        token = project.token.split(" ")[0]
        payload = jwt.decode(token, SECRET_KEY, algorithms="HS256")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"An internal server error occurred: {str(e)}")

    if not validate_username(project.newProjectName):
        raise HTTPException(status_code=400, detail="Project name must only contain letters or numbers and be less than 30 characters long")
    
    try:
        # Update project context
        projects_collection.update_one({ "email": payload["email"], "projectName": project.oldProjectName }, {"$set": {"context": project.newProjectContext}})
    
        # Ensure no other project has the new project name
        pname_cursor = projects_collection.find({ "email": payload["email"], "projectName": project.newProjectName })
        projects_with_projname = json.loads(json_util.dumps(list(pname_cursor)))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to update project context with error: {e}")

    if len(projects_with_projname) > 1:
        raise HTTPException(status_code=400, detail="New project name already exists")
    
    # Update project name
    if len(projects_with_projname) == 0: # If no project exits that shares the project name
        try:
            projects_collection.update_one({ "email": payload["email"], "projectName": project.oldProjectName }, {"$set": {"projectName": project.newProjectName}})
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to update project name with error: {e}")

    cursor = projects_collection.find({ "email": payload["email"] }, {"apikey": 0, "email": 0})
    projects = json.loads(json_util.dumps(list(cursor)))

    return {"message": "Project updated successfully", "token": token, "projects": projects}

@app.post("/delete-project")
def delete_project(project: DeleteProject):
    try:
        token = project.token.split(" ")[0]
        payload = jwt.decode(token, SECRET_KEY, algorithms="HS256")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"An internal server error occurred: {str(e)}")
    
    projects_collection.delete_one({ "email": payload["email"], "projectName": project.deleteProjectName })

    cursor = projects_collection.find({ "email": payload["email"] }, {"apikey": 0, "email": 0})
    projects = json.loads(json_util.dumps(list(cursor)))

    return {"message": "Project deleted successfully", "token": token, "projects": projects}

@app.post("/verify-token")
def verify_token(token: str = Body(..., embed=True)):
    try:
        token = token.split(" ")[0]
        payload = jwt.decode(token, SECRET_KEY, algorithms="HS256")

        return {"token": token}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"An internal server error occurred: {str(e)}")

@app.post("/chatbot")
def chatbot(chat: Chat):
    apikey = hash_api_key(chat.apikey)

    project = projects_collection.find_one({ "apikey": apikey })

    if not project:
        raise HTTPException(status_code=400, detail="Invalid API key")
    
    # Check if quota limit has been exceeded
    if project["quotaLimit"] and project["quotaUsage"] >= project["quotaLimit"]:
        raise HTTPException(status_code=400, detail="You have exceeded your quota limit for the month")
    
    # Increment usage
    projects_collection.update_one({ "apikey": apikey }, {"$set": {"quotaUsage": project["quotaUsage"] + 1}})

    # Call inference endpoint with project["context"] as context
    try:
        response = client.question_answering(
            question=chat.text,
            context=project["context"],
            model="distilbert/distilbert-base-cased-distilled-squad"
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"An internal server error occurred: {str(e)}")

    return { "message": "Details sent successfully", "response": response }