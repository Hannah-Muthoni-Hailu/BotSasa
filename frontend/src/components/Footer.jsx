import { Container } from "react-bootstrap"

export default function Footer() {
    return(
        <Container className="d-flex justify-content-around p-3 border-top border-secondary footer-item">
            <a href="">Privacy Policy</a>
            <a href="">Terms of Service</a>
        </Container>
    )
}