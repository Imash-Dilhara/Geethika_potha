import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./navbar.jsx";
import Footer from './footer.jsx';
import Home from './Home.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import './css/App.css';

function App(){
    return(
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>

            <Footer /> {/* Footer එක හැම තැනම පෙන්වීමට */}
        </BrowserRouter>
    );
}

export default App;