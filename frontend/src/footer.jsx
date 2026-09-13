import React from "react";
import './css/footer.css';

function Footer(){
    return(
        <>
            <div class="footerBox">
                <div class="componentsBox">
                    <div class="logo">
                        <img src="assets/logo-white.png" alt="Logo"/>
                        <p>HymnFlow connects hearts through worship, bringing classic and modern hymns together for congregations and praise teams everywhere.</p>
                    </div>
                    <div class="listContent">
                        <ul>
                            <li><a href="index.php">Home</a></li>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    <div class="Contact">
                        <address>NIDS PLC,<br/>Weragoda, Kahawa</address>
                        <p>Email: info@hymnflow.com</p>
                        <p>Phone: (76) 079 5982</p>
                    </div>
                </div>
                <div class="copyright">
                        <hr/>
                        <p>&copy; 2026 HymnFlow. All rights reserved.</p>
                    </div>
            </div>
        </>
    );
}

export default Footer;