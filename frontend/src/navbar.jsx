import React from "react";
import './css/navbar.css';

function Navbar(){
    return(
        <div>
            <div class="bannerBox"> 
                <div class="bannerShadow">
                    <div class="logoName">
                        <img src="assets/logo-white.png" alt="HymnFlow logo" onclick="window.location.href='index.php'"/>
                    </div>
                    <div class = "pageName">
                        <h1 id = "pageName">Home</h1>
                    </div>
                    <div class="linksName">
                        <ul>
                            <li><a href="">Home</a></li>
                            <li>About</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;