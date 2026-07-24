import { Container, Button } from 'react-bootstrap';
import automatic from '../assets/automatic.png';
import saas from '../assets/saas.png';
import kenya from '../assets/Kenya.png';

export default function WhyUs() {
    return(
        <Container className='mt-5 text-center text-white'>
            <h2>Why Choose Us?</h2>
            <div className='d-md-flex justify-content-between pt-3'>
                <div className='px-3'>
                    <img src={automatic} alt="An icon of a gear within revolving arrows" height="80" className='mb-2' />
                    <h4>Setup Guidance</h4>
                    <p>Our built-in chatbot can offer guidance on how to integrate the API key into your project based on your tech stack.</p>
                </div>
                <div className='px-3'>
                    <img src={kenya} alt="An icon of a gear within revolving arrows" height="80" className='mb-2' />
                    <h4>Built for Kenyans</h4>
                    <p>This tool is built by Kenyans, for Kenyans. The models used are lightweight supporting lower-end PCs that are more common in the country.</p>
                </div>
                <div className='px-3'>
                    <img src={saas} alt="An icon of a gear within revolving arrows" height="80" className='mb-2' />
                    <h4>Pay-Per-Use</h4>
                    <p>You only pay for what you use. Every single message sent through your API key only costs you 2 shillings, nothing more.</p>
                </div>
            </div>
        </Container>
    )
}