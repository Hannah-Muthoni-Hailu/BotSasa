import { Container, Button } from 'react-bootstrap'
import automatic from '../assets/automatic.png'
import hosting from '../assets/hosting.png'
import maintenance from '../assets/maintenance.png'

export default function WhyUs() {
    return(
        <Container className='mt-5 text-center text-white'>
            <h2>Why Choose Us?</h2>
            <div className='d-md-flex justify-content-between pt-3'>
                <div className='px-3'>
                    <img src={automatic} alt="An icon of a gear within revolving arrows" height="80" className='mb-2' />
                    <h4>Automatic Setup</h4>
                    <p>The creation of the chatbot is completely handled by BotSasa and all you have to do is create a PDF document</p>
                </div>
                <div className='px-3'>
                    <img src={hosting} alt="An icon of a gear within revolving arrows" height="80" className='mb-2' />
                    <h4>Automatic Setup</h4>
                    <p>The creation of the chatbot is completely handled by BotSasa and all you have to do is create a PDF document</p>
                </div>
                <div className='px-3'>
                    <img src={maintenance} alt="An icon of a gear within revolving arrows" height="80" className='mb-2' />
                    <h4>Automatic Setup</h4>
                    <p>The creation of the chatbot is completely handled by BotSasa and all you have to do is create a PDF document</p>
                </div>
            </div>
        </Container>
    )
}