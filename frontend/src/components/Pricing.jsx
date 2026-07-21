import { Link } from 'react-router-dom'
import { useState } from 'react';
import { Container, Button, Form } from "react-bootstrap";
import check from '../assets/Check.png'
import X from '../assets/X.png';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export default function Pricing() {
    let [users, setUsers] = useState(0);
    let [estimate, setEstimate] = useState(`Ksh.${users * 0.005}`)
    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 100000,
            label: '100000',
        },
        {
            value: 25000,
            label: '25000',
        },
        {
            value: 75000,
            label: '75000',
        },
        {
            value: 50000,
            label: '50000',
        },
    ];

    function valuetext(value) {
        setUsers(value);
        setEstimate(`Ksh.${value * 0.05}`);
    };

    return(
        <Container className="text-center text-white mt-5 pt-3" id="pricing">
            <div className="text-start bg-white text-black price-box p-4">
                <h2 className='my-0 ms-3'>Only pay for what you use</h2>
                <p className='fs-6 ms-3'>Drag the toggle to see an estimated cost based on number of chatbot messages</p>
                <Box sx={{ width: "75%" }} className="mx-auto">
                    <Slider
                        aria-label="Always visible"
                        defaultValue={0}
                        getAriaValueText={valuetext}
                        step={1}
                        min={0}
                        max={100000}
                        marks={marks}
                        valueLabelDisplay="auto"
                        color="secondary"
                    />
                </Box>
                <div className='d-flex w-75 my-3 mx-auto'>
                    <Form className='mx-auto p-3 border border-2 border-dark rounded-2 w-100 d-flex flex-column align-items-center'>
                        
                        <Form.Group className="mb-3 text-center" controlId="numOfUsers">
                            <Form.Label>Number of users <span className='text-secondary'>(You can type in a number below)</span></Form.Label>
                            <Form.Control type="text" value={users} className='fs-5 border-2 border-dark text-center' onChange={e => valuetext(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3 text-center" controlId="numOfUsers">
                            <Form.Label>Estimate</Form.Label>
                            <Form.Control type="text" value={estimate} className='fs-5 border-2 border-dark text-center' readOnly disabled></Form.Control>
                        </Form.Group>
                        <Link to="/signup" state={{ isSigningUp: 'true' }}>
                            <Button className="btn-filled me-md-2 mb-2 mb-md-0">Get started</Button>
                        </Link>
                    </Form>
                </div>
            </div>
        </Container>
    )
}