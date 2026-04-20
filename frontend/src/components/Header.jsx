import { Link } from 'react-router-dom'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import logo from '../assets/logo.png'

export default function Header() {
    return(
        <Navbar expand="lg">
            <Container fluid className='d-flex justify-content-between align-items-center m-0 p-0'>
                <div className="d-none d-lg-block w-25"></div>
                <Navbar.Brand 
                    href="/home" 
                    className='w-50 d-flex align-items-center justify-content-start justify-content-lg-center pt-0'
                >
                    <img src={logo} alt="logo" height="40" className="pt-1 mt-2" />
                    <h2 className="m-0 text-white align-self-start logoText">BotSasa</h2>
                </Navbar.Brand>
                <div className="mx-1 p-0 w-25 d-flex flex-row justify-content-end">
                    <Link to="/signup" state={{ isSigningUp: 'true' }} className='mx-1'>
                        <Button className='btn-clear'>Signup</Button>
                    </Link>
                    <Link to="/signup" state={{ isSigningUp: 'false' }}>
                        <Button className='btn-filled'>Login</Button>
                    </Link>
                </div>
            </Container>
        </Navbar>
    )
}