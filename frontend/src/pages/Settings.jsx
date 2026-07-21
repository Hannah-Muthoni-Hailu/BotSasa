import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import logo from '../assets/logo.png';

export default function Settings() {
    const navigate = useNavigate()
    const [token, setToken] = useState(localStorage.getItem("access_token"));

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

    const [user, setUser] = useState(() => {
        const saved_projects = JSON.parse(localStorage.getItem("user"));
        return saved_projects ? saved_projects : []
    });
    const [isSending, setIsSending] = useState(false);

    const handleChange = async () => {
        try {
            const res = await fetch('https://botsasa-6acp.onrender.com/settings', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            })

            const response = await res.json()

            if (!res.ok) {
                throw new Error(response.detail || "Signup failed");
            }

            localStorage.setItem("user", JSON.stringify(response.user));
            alert("Your changes have been saved")
        } catch (error) {
            alert('An error occured! Please try again later')
        }
    }

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
            <a href="/dashboard" className="text-decoration-none float-end mt-4">
                <Button className='new-project'>Dashboard</Button>
            </a>
            <Form className='w-50 m-auto mt-5'>
                <Form.Group className="mb-4" controlId="name">
                    <Form.Label className='fs-5'>Username</Form.Label>
                    <Form.Control type="text" placeholder="name" value={user['username']} onChange={e => setUser({...user, username: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-4" controlId="email">
                    <Form.Label className='fs-5'>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={user['email']} disabled />
                </Form.Group>
                <Button className='get-started' onClick={handleChange}> Save
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
                </Button>
            </Form>
            <div className='border border-3 border-danger bg-light text-danger fs-5 mt-5 rounded p-3 w-50 m-auto'>
                <h3>Danger Zone</h3>
                <p>To delete your account, please send an email to <a href="mailto:muthonihannahhailu@gmail.com" className='text-dark'>muthonihannahhailu@gmail.com</a> </p>
            </div>
        </Container>
    )
}