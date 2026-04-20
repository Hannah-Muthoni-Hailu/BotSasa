import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import Footer from './components/Footer';
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/settings' element={<Settings />} />
                <Route path='*' element={<h2>404. Page not found</h2>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
