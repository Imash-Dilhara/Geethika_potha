import React from "react";
import './css/footer.css';
import { Link } from "react-router-dom";

function Footer(){
    return(
        <>
            <div className="footerBox">
                <div className="componentsBox">
                    <div className="logo componentsBox-element">
                        <img src="assets/logo-white.png" alt="Logo"/>
                        <p>HymnFlow connects hearts through worship, bringing classic and modern hymns together for congregations and praise teams everywhere.</p>
                    </div>
                    <div className="listContent componentsBox-element">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="Contact componentsBox-element">
                        <address>NIDS PLC,<br/>Weragoda, Kahawa</address>
                        <p>Email: info@hymnflow.com</p>
                        <p>Phone: (76) 079 5982</p>
                    </div>
                </div>
                <div className="copyright ">
                        <hr/>
                        <p>&copy; 2026 HymnFlow. All rights reserved.</p>
                    </div>
            </div>
        </>
    );
}

export default Footer;