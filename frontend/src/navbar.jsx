import React from "react";
import { Link } from "react-router-dom";
import './css/navbar.css';

function Navbar(){
    return(
        <div>
            <div className="bannerBox"> 
                <div className="bannerShadow">
                    <div className="logoName">
                        <img src="assets/logo-white.png" alt="HymnFlow logo"/>
                    </div>
                    <div className = "pageName">
                        <h1 id = "pageName">Home</h1>
                    </div>
                    <div className="linksName">
                        <ul>
                            <li><Link to = "/">Home</Link></li>
                            <li><Link to = "/about">About</Link></li>
                            <li><Link to = "/contact">Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;