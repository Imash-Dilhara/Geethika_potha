import React , { Suspense , lazy } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import ('./Home.jsx'));

import Navbar from "./navbar.jsx";
import Footer from './footer.jsx';
// import Home from './Home.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import AddHymn from "./components/AddHymn.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ViewAllHymn from "./components/ViewAllHymn.jsx";
import CreateHymnSolt from "./components/CreateSlot.jsx";
import ChangePassword from "./components/ChnagePassword.jsx";

function App(){

    const param = new URLSearchParams(window.location.search);
    const resetToken = param.get('token');

    if(window.location.pathname === '/reset-password' && resetToken){
        return (
            <Routes>
                <Route path="/reset-password" element={<ChangePassword/>}/>
            </Routes>
        );
    }

    return(
        <>
            <Navbar />
            <ScrollToTop />

            <Routes>
                <Suspense fallback={<div className="loader-wrap"><div className="spinner"></div></div>}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/addHymn" element={<AddHymn />} />
                    <Route path="/viewallhymn" element={<ViewAllHymn />} />
                    <Route path="/createHymnSlot" element={<CreateHymnSolt />} />
                </Suspense>
            </Routes>

            <Footer />
        </>
    );
}

export default App;