import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import hero from '../assets/hero.png'

export default function Hero() {
    return(
        <Container fluid className="d-md-flex flex-row-reverse mt-4">
            <div className="d-flex">
                <img src={hero} alt="image showing a pdf's content being input into a chatbos" className=" mx-md-0 mx-auto w-75 align-self-end" />
            </div>
            <div className='pt-l-5 ps-2 mt-2 mt-md-5 text-md-start text-center'>
                <h1 style={{ 'color': '#1EB7E2' }}>Build Custom Chatbots</h1>
                <h2 className='text-white'>At the click of a button</h2>
                <p className='w-75 mx-md-0 mx-auto text-white'>
                    Simply upload a document containing all the details you’d like your clients to know and let BotSasa handle the rest
                </p>
                <Link to="/signup" state={{ isSigningUp: 'true' }} className='mx-1'>
                    <Button className="btn-filled me-2" style={{ 'width': '150px' }}>Get started</Button>
                </Link>
                <a href="#pricing">
                    <Button className="btn-clear">Explore solutions</Button>
                </a>
            </div>
        </Container>
    )
}