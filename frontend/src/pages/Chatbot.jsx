import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export default function Chatbot() {
    const [show, setShow] = useState(false);
        
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [typing, setTyping] = useState(false);

    const [messages, setMessages] = useState([
        {
        message: "Hello! How can I help?",
        sender: "bot"
        }
    ]);

    const handleSend = async (text) => {
        const userMessage = {
            message: text,
            sender: "user"
        };

        // Add user message
        setMessages((prev) => [...prev, userMessage]);

        try {
            setTyping(true);
            const response = await fetch("https://botsasa-6acp.onrender.com/chatbot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: text, apikey: import.meta.env.VITE_CHATBOT_KEY })
            });

            const data = await response.json();

            const botMessage = {
            message: data.response.answer,
            sender: "bot"
            };

            // Add bot response
            setMessages((prev) => [...prev, botMessage]);
            setTyping(false);
        } catch (error) {
            console.error(error);
        }
    };

    return(
        <div>
            <Button id="chatbotIcon" onClick={handleShow}>
                <img src={logo} alt="Logo icon" style={{ width: '90%' }} />
            </Button>

            <Modal show={show} onHide={handleClose} id="modal" backdrop={false}>
                <Modal.Header className='modalHeader' closeButton closeVariant="white">
                    <img src={logo} alt="Chatbot icon" style={{ width: '40px' }} className="img-fluid" />
                </Modal.Header>
                <Modal.Body id="modalBody" className='d-flex flex-column'>
                    <MainContainer>
                        <ChatContainer>
                        <MessageList typingIndicator={typing ? <TypingIndicator content="Bot is typing..." /> : null} >
                            {messages.map((msg, index) => (
                                <Message
                                    key={index}
                                    model={{
                                        message: msg.message,
                                        sender: msg.sender,
                                        direction: msg.sender === "user" ? "outgoing" : "incoming"
                                    }}
                                    />
                            ))}
                        </MessageList>

                        <MessageInput placeholder="Type message here..." onSend={handleSend} attachButton={false} />
                        </ChatContainer>
                    </MainContainer>
                </Modal.Body>
            </Modal>
        </div>
    )
}