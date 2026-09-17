import React ,{ useState } from "react";
import { Link , useLocation } from "react-router-dom";
import './css/navbar.css';

function Navbar(){

    const location = useLocation();

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const [isLogin , setIsLogin] = useState(false);
    const [userName , setUserName] = useState("");

    let pageTitle = "Home";
    if(location.pathname === "/about") pageTitle = "About";
    else if(location.pathname === "/contact") pageTitle = "Contact";
    else if(location.pathname === "/addHymn") pageTitle = "Add Hymn";

    const firstLetter = userName ? userName.charAt(0).toUpperCase() : "";
 
    return(
        <div>
            <div className="bannerBox"> 
                <div className="bannerShadow">
                    <div className="logoName">
                        <Link to="/"><img src="assets/logo-white.png" alt="HymnFlow logo"/></Link>
                    </div>
                    <div className = "pageName">
                        <h1 id = "pageName">{pageTitle}</h1>
                    </div>
                    <div className="linksName">
                        <ul>
                            <li className="navLink"><Link to = "/">Home</Link></li>
                            <li className="navLink"><Link to = "/about">About</Link></li>
                            <li className="navLink"><Link to = "/contact">Contact</Link></li>
                            <li>
                                {isLogin ? (
                                    <div className="userAvatar" title={userName}>{firstLetter}</div>
                                ):(
                                    <button 
                                        className="registerBtn" 
                                        onClick={() => setIsRegisterOpen(true)}>
                                            Register
                                    </button>
                                )}
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>

            {isRegisterOpen && (
                <div className="modalBox" onClick={() => setIsRegisterOpen(false)}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <h2>Create an Account</h2>
                            <button 
                                className="closeBtn" 
                                onClick={() => setIsRegisterOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            setIsLogin(true); 
                            setIsRegisterOpen(false); 
                        }}>
                            <div className="form-group">
                                <input 
                                    id="userFname" 
                                    type="text" 
                                    placeholder="User First Name"
                                    onChange={(e) => setUserName(e.target.value)} 
                                    required /><br />
                                <small></small>
                            </div>
                            <div className="form-group">
                                <input id="userLname" type="text" placeholder="User Last Name" />
                            </div>
                            <div className="form-group">
                                <input id="userEmail" type="email" placeholder="Email" required /><br />
                                <small></small>
                            </div>
                            <div className="form-group">
                                <input id="userPass" type="password" placeholder="Password" required /><br />
                                <small></small>
                            </div>
                            <div className="formSubBtn">
                                <button type="submit" className="submit-btn">Register</button>
                            </div>
                        </form>
                    
                    </div>
                </div>
            )}

        </div>
    );
}

export default Navbar;