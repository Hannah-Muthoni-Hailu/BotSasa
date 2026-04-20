import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import WhyUs from '../components/WhyUs';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default function Home() {
    return(
        <>
            <Header />
            <Hero />
            <About />
            <WhyUs />
            <Pricing />
            <Footer />
        </>
    )
}