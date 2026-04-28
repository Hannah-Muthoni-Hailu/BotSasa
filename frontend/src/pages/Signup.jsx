import { useState } from 'react';
import { useLocation, useNavigate, Link, data } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import logo from '../assets/logo.png'

export default function Signup() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isSending, setIsSending] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState("");
    const [errors, setErrors] = useState("");

    if (isSignup == "") {
        setIsSignup(location.state?.isSigningUp || "true")
    }

    const handleSignup = async () => {
        setErrors("") // Reset errors list
        try {
            setIsSending(true);
            const res = await fetch("https://botsasa-6acp.onrender.com/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password }),
            });

            const response = await res.json();
            if (!res.ok) {
                if (typeof response.detail === "string") {
                    throw new Error(response.detail || "Signup failed")
                }
                if (Array.isArray(response.detail)) {
                    // return response.detail.map(err => err.msg).join(", ");
                    throw new Error(response.detail.map(err => err.msg).join(", ") || "Signup failed")
                }
            }

            localStorage.setItem("access_token", response.token);
            localStorage.setItem("projects", response.projects);

            navigate("/dashboard");

        } catch (err) {
            setErrors(err.message);
        } finally {
            setIsSending(false);
        }
    }

    const handleLogin = async () => {
        setErrors("")
        try {
            setIsSending(true);
            const res = await fetch("https://botsasa-6acp.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
            });

            const response = await res.json();

            if (!res.ok) {
                if (typeof response.detail === "string") {
                    throw new Error(response.detail || "Signup failed")
                }
                if (Array.isArray(response.detail)) {
                    // return response.detail.map(err => err.msg).join(", ");
                    throw new Error(response.detail.map(err => err.msg).join(", ") || "Signup failed")
                }
            }

            localStorage.setItem("access_token", response.token);
            localStorage.setItem("projects", JSON.stringify(response.projects));

            navigate("/dashboard");

        } catch (error) {
            setErrors(error.message);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <Form className='mx-auto border rounded-3 px-3 px-lg-5 pt-4 pb-5 signup-form'>
            {errors && (
                <Alert variant="danger" onClose={() => setErrors("")} dismissible>
                {errors}
                </Alert>
            )}
            <div className='text-center'>
                <img src={logo} alt="logo" height="60" className='mb-3'/>
            </div>
            { 
                isSignup == 'true' ?
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="name" value={username} onChange={e => setUsername(e.target.value)} />
                    </Form.Group> 
                : null
            }
            
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            { 
                isSignup == 'true' ? <Form.Check type='checkbox' label='By signing up you agree to our Privacy Policy and Terms and Conditions' id='privacyAndTerms' className='text-white mb-3' />
                : null
            }
            
            <div className='text-center'>
                <div>
                    <Link state={{ isSignup: 'true' }}>
                        <Button className='get-started' onClick={isSignup == 'true' ? handleSignup : handleLogin}>
                            { isSignup == 'true' ? 'Signup' : 'Login' }
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
                    </Link>
                </div>
                <br />
                <Link
                    onClick={() => isSignup == 'true' ? setIsSignup('false') : setIsSignup('true')}
                >
                    { isSignup == 'true' ? 'Already signed ? Login' : 'Don\'t have an account? Signup' }
                </Link>
            </div>
        </Form>
    )
}