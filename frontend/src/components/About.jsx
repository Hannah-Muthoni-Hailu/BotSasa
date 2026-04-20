import { Link } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'

export default function About() {
    return(
        <Container fluid style={{ 'borderTop' : '1px solid #6D6FBF', 'borderBottom' : '1px solid #6D6FBF' }} className='mt-5 py-5'>
            <div className="text-center w-50 mx-auto">
                <h2 className='text-white'>Upgrade your business in minutes</h2>
                <p className='text-white fs-6'>
                    Allow BotSasa to handle your customer support for you right from your website. And all you need is a PDF document.
                </p>
                <Link to="/signup" state={{ isSigningUp: 'true' }} className='mx-1'>
                    <Button className="btn-filled me-2" style={{ 'width': '150px' }}>Get started</Button>
                </Link>
            </div>
        </Container>
    )
}