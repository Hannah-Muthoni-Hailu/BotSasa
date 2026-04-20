import { Link } from 'react-router-dom'
import { Container, Button } from "react-bootstrap";
import check from '../assets/Check.png'
import X from '../assets/X.png'

export default function Pricing() {
    return(
        <Container className="text-center text-white mt-5" id="pricing">
            <h2>Pricing</h2>
            <p>Only pay for what you use</p>
            <div className="d-md-flex justify-content-around text-start">
                <div className="price-box bg-white text-black px-5 py-3 my-5">
                    <p className="m-0"><strong><span className="fs-1">0$</span><small>/message</small></strong></p>
                    <p className="text-secondary mt-0" style={{ 'fontSize': '10px' }}>Capped at 20 messages per month</p>
                    <Link to="/signup" state={{ isSigningUp: 'true' }} className='mx-auto'>
                        <button className='get-started'>Get Started</button>
                    </Link>
                    <p className='mt-3'><strong>Features included:</strong></p>
                    <ul>
                        <li>
                            <p><img src={check} alt="check mark" /> Free messages</p>
                        </li>
                        <li>
                            <p><img src={X} alt="check mark" /> Automatic setup</p>
                        </li>
                        <li>
                            <p><img src={X} alt="check mark" /> Wordpress support</p>
                        </li>
                        <li>
                            <p><img src={X} alt="check mark" /> Customer support</p>
                        </li>
                    </ul>
                </div>
                <div className="price-box bg-white text-black px-5 py-3 my-5">
                    <p className="m-0 mb-3"><strong><span className="fs-1">0.20$</span><small>/100 messages</small></strong></p>
                    <Link to="/signup" state={{ isSigningUp: 'true' }} className='mx-auto'>
                        <button className='get-started'>Get Started</button>
                    </Link>
                    <p className='mt-3'><strong>Features included:</strong></p>
                    <ul>
                        <li>
                            <p><img src={check} alt="check mark" /> Free messages</p>
                        </li>
                        <li>
                            <p><img src={check} alt="check mark" /> Automatic setup</p>
                        </li>
                        <li>
                            <p><img src={check} alt="check mark" /> Wordpress support</p>
                        </li>
                        <li>
                            <p><img src={check} alt="check mark" /> Customer support</p>
                        </li>
                    </ul>
                </div>
            </div>
        </Container>
    )
}