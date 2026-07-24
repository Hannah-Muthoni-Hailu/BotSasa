import { Container } from "react-bootstrap"

export default function Footer() {
    return(
        <Container className="d-flex justify-content-around p-3 border-top border-secondary footer-item mt-5">
            <a href="/privacy.html">Privacy Policy</a>
            <a href="/terms.html">Terms of Service</a>
        </Container>
    )
}