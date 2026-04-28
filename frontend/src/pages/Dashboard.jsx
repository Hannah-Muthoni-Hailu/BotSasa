import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Clipboard, Check } from 'react-bootstrap-icons';
import trash from '../assets/Trash 2.png'
import penTool from '../assets/Pen tool.png'
import logo from '../assets/logo.png';
import plus from '../assets/Plus.png';

export default function Dashboard() {
    const navigate = useNavigate()
    const [token, setToken] = useState(localStorage.getItem("access_token"))

    // Set the token
    useEffect(() => {
        const verifyUser = async () => {
            if (!token) {
                navigate("/")
            }
            try {
                const res = await fetch("https://botsasa-6acp.onrender.com/verify-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token })
                })
                
                const response = await res.json()

                if (!res.ok) {
                    throw new Error(response.detail || "Validation token verification failed")
                }
            } catch (error) {
                console.log(error.message)
                navigate("/") // Navigate to homepage if token is expired
            }
        }
        verifyUser();
    }, [token, navigate]);
    
    const [isSending, setIsSending] = useState(false);
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [projects, setProject] = useState(() => {
        const saved_projects = JSON.parse(localStorage.getItem("projects"));
        return saved_projects ? saved_projects : []
    });
    const [editedProject, setEditedProject] = useState({});
    const [projectName, setProjectName] = useState("");
    const [projectType, setProjectType] = useState("paid");
    const [projectDetails, setProjectDetails] = useState("");
    const [error, setError] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const handleDelete = (project) => {
        setEditedProject(project)
        setShowDelete(true);
    }

    const handleDeleteConfirmed = async () => {
        setError("")
        try {
            setIsSending(true);
            const deleteProjectName = editedProject.projectName

            const res = await fetch("https://botsasa-6acp.onrender.com/delete-project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, deleteProjectName })
            })

            const response = await res.json();

            if (!res.ok) {
                console.log(response)
                throw new Error(response.detail || "Project deletion failed")
            }

            localStorage.setItem("access_token", response.token);
            localStorage.setItem("projects", JSON.stringify(response.projects))
            setProject(response.projects)

            // Close modal
            setShowDelete(false);
            setEditedProject({});
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSending(false);
        }
    }

    const handleEdit = (project) => {
        const newProject = {...project, oldProjectName: project.projectName} // Set incase of change
        setEditedProject(newProject);
        setShowEdit(true);
    }

    const handleSubmitEdit = async () => {
        setError("")
        try {
            setIsSending(true);
            const oldProjectName = editedProject.oldProjectName
            const newProjectName = editedProject.projectName
            const newProjectContext = editedProject.context

            const res = await fetch("https://botsasa-6acp.onrender.com/edit-project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, oldProjectName, newProjectName, newProjectContext }) // Pass in an old project name for lookup and the edited fields (either project name or context)
            })

            const response = await res.json();

            if (!res.ok) {
                console.log(response)
                throw new Error(response.detail || "Project update failed")
            }

            localStorage.setItem("access_token", response.token);
            localStorage.setItem("projects", JSON.stringify(response.projects))
            setProject(response.projects)

            // Close modal
            setShowEdit(false);
            setEditedProject({});
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSending(false);
        }
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Validation
        if (file.type !== "text/plain") {
            setError("Only .txt files are allowed");
            return
        }

        try {
            setError("");
            const text = await file.text();

            editedProject == {} ? setEditedProject({...editedProject, context: text}) : setProjectDetails(text)
        } catch (err) {
            setError("Failed to read file")
        }
    }

    const handleSubmit = async () => {
        setError("")
        try {
            setIsSending(true);
            const token = localStorage.getItem("access_token")

            const res = await fetch("https://botsasa-6acp.onrender.com/new-project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, projectName, projectType, projectDetails })
            })

            const response = await res.json();

            if (!res.ok) {
                throw new Error(response.detail || "New project creation failed")
            }

            localStorage.setItem("access_token", response.token);
            localStorage.setItem("projects", JSON.stringify(response.projects))
            setProject(response.projects)
            setApiKey(response.api_key)

            // Reset variables
            setProjectName("")
            setProjectDetails("")
            setProjectType("paid")

            // Close current Modal
            setShow(false);
            // Open modal for displaying api key
            setShowKey(true);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsSending(false);
        }
    }

    const handleApiClose = () => {
        // Discard api key
        setApiKey("")
        // Close modal
        setShowKey(false)
    }

    const handleCopy = async () => {
        try {
        // Modern way to write to clipboard
        await navigator.clipboard.writeText(apiKey); 
        setCopied(true);
        // Reset the "Copied" state after 2 seconds
        setTimeout(() => setCopied(false), 2000); 
        } catch (err) {
        console.error('Failed to copy!', err);
        }
    };

    return (
        <Container>
            <div>
                <div
                    href="/home"
                    className='w-50 d-flex align-items-center justify-content-start justify-content-lg-center pt-0 mt-2'
                    style={{ 'marginLeft': '25%' }}
                >
                    <img src={logo} alt="logo" height="40" className="pt-1 mt-2" />
                    <h2 className="m-0 text-white align-self-start logoText">BotSasa</h2>
                </div>
            </div>

            <main>
                <Button className='new-project mt-4' onClick={() => setShow(true)}>
                    <img src={plus} alt="plus sign" height={20} /> New Project
                </Button>
                <table className='table mt-4 projects-table'>
                    <thead>
                        <tr style={{ '--bs-table-bg': '#8c8dce', 'backgroundColor': '#8c8dce', '--bs-table-color': '#ffffff' }}>
                            <th>Project Name</th>
                            <th>Quota Limit</th>
                            <th>Billing Cycle End Date</th>
                            <th>Total Spending</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            projects.map((project) => {
                                return (
                                    <tr key={project.projectName} style={{ '--bs-table-bg': '#4B4CA1', 'backgroundColor': '#4B4CA1', '--bs-table-color': '#ffffff' }}>
                                        <td>{project.projectName}</td>
                                        <td>{project.quotaLimit ? project.quotaLimit : "None"}</td>
                                        <td>{new Date(project.endBillingCycle.$date).toISOString().split('T')[0]}</td>
                                        <td>{project.quotaUsage}</td>
                                        <td>
                                            <button className='border border-light rounded-circle me-1 mb-1'>
                                                <img src={penTool} alt="edit icon" height={20} onClick={() => handleEdit(project)} />
                                            </button>
                                            <button className='border border-danger rounded-circle bg-danger'>
                                                <img src={trash} alt="trash icon" height={20} onClick={() => handleDelete(project)} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </main>

            {/* Modal for creating a new project */}
            <Modal show={show} onHide={() => setShow(false)}>
                <Form className='px-3 px-lg-5 pt-4 pb-5'>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3" controlId="projectName">
                        <Form.Label>Enter project name</Form.Label>
                        <Form.Control type="text" placeholder="My cool project" value={projectName} onChange={e => setProjectName(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId='contextFile' className='mb-3 mt-3'>
                        <Form.Label>
                            Input context file (.txt format only)
                        </Form.Label>
                        <Form.Control type='file' accept='.txt' onChange={handleFileChange} />
                    </Form.Group>
                    <div className="text-center">
                        <Button className='get-started me-2' style={{ 'width': "80px" }} onClick={() => setShow(false)}>Close</Button>
                        <Button className='get-started' onClick={handleSubmit}>
                            {isSending ?
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                /> :
                                null
                            }
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Modal for displaying an api key */}
            <Modal show={showKey} backdrop="static" onHide={handleApiClose}>
                <Modal.Header closeButton>
                    API key
                </Modal.Header>
                    <Modal.Body className='p-4'>
                        <p><strong>Copy the api key below</strong></p>
                        <p className='text-danger'><small>Note that once you close this modal, you cannot view the key again</small></p>
                        <Card className="position-relative bg-light">
                            <Button variant="outline-secondary" size="sm" onClick={handleCopy} style={{position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10,}}>
                               {copied ? <Check /> : <Clipboard />}
                            </Button>
                            <Card.Body>
                                <pre className="mb-0 mt-4">
                                    <code>{apiKey}</code>
                                </pre>
                            </Card.Body>
                        </Card>
                        <p>To use your chatbot, send a fetch request to "<a href="#" className='text-black text-decoration-underline'>https://botsasa-6acp.onrender.com/chatbot</a>" <br /> supplying <code>("apikey": "string", "text": "string" )</code>.</p>
                    </Modal.Body>
            </Modal>

            {/* Modal for editing an existing project */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Form className='px-3 px-lg-5 pt-4 pb-5'>
                    {error && <Alert variant="danger" dismissible>{error}</Alert>}
                    <Form.Group className="mb-3" controlId="projectName">
                        <Form.Label>Enter project name</Form.Label>
                        <Form.Control type="text" placeholder="My cool project" value={editedProject.projectName} onChange={e => setEditedProject({...editedProject, projectName: e.target.value})} />
                    </Form.Group>

                    <Form.Group controlId='contextFile' className='mb-3 mt-3'>
                        <Form.Label>
                            Input context file (.txt format only)
                        </Form.Label>
                        <Form.Control type='file' accept='.txt' onChange={handleFileChange} />
                    </Form.Group>
                    {
                        editedProject.projectType == 'paid' ? <p>Enter credit card details</p> : null
                    }
                    <div className="text-center">
                        <Button className='get-started me-2' style={{ 'width': "80px" }} onClick={() => setShowEdit(false)}>Close</Button>
                        <Button className='get-started' onClick={handleSubmitEdit}>
                            {isSending ?
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                /> :
                                null
                            }
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Modal for deleting an existing project */}
            <Modal show={showDelete} onHide={() => setShowDelete(false)}>
                <Modal.Body >
                    <h3>Are you sure you want to delete this project?</h3>
                    <p className="text-danger">This action cannot be undone</p>
                    <Button className='get-started me-2' style={{ 'width': "80px" }} onClick={() => setShowDelete(false)}>No</Button>
                    <Button className='get-started' style={{ 'width': "80px" }} onClick={handleDeleteConfirmed}>
                        {isSending ?
                            <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> :
                            null
                        }
                        Yes
                    </Button>
                </Modal.Body>
            </Modal>
        </Container>
    )
}
