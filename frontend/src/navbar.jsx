import React, { useState , useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { validateRegister, validateLogin } from "./utils/creat-account-validation";
import ForgotPassword from "./components/ForgotPassword";
import axios from 'axios';
import './css/navbar.css';

function Navbar() {
    const location = useLocation();

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [haveAccount, setHaveAccount] = useState(true);
    const [isClickAvatar, setIsClickAvatar] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [userName, setUserName] = useState("");
    const [isForgotPassword , setIsForgotPassword] = useState(false);
    const [ registrationTitle , setRegistrationTitle] = useState('Log In');
    const [errors, setErrors] = useState({});

    const [isOtpSend , setIsOtpSend] = useState(false);
    const [isEmailVerified , setIsEmailVerified] = useState(false);
    const [loading , setLoading] = useState(false);
    const [message , setMessage] = useState('');
    const [timer , setTimer] = useState(120);
    const [isResendOtp , setIsResendOtp] = useState(false);

    useEffect(() => {
        let interval = null;
        if(isOtpSend && timer > 0){
            interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            } , 1000);
        }else if(timer === 0){
            setIsResendOtp(true);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isOtpSend , timer]);

    const handleResendOtp = async() => {
        setIsResendOtp(false);
        setTimer(120);
        setMessage('Resending OTP to your email...');

         try {
            const res = await axios.post('http://localhost:5000/api/send-otp', {
                email: formData.email
            });
            if (res.data.success) {
                setMessage('A new OTP has been sent to your email!');
                setFormData((prev) => ({ ...prev, otp: '' }));
            }
        } catch (e) {
            setMessage('Failed to resend OTP. Please try again.');
            setIsResendOtp(true);
            setTimer(0);
        }
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleEmailBlur = async () => {
        if(isValidEmail(formData.email) && !isOtpSend && !isEmailVerified){
            setLoading(true);
            setMessage('Sending OTP to your email...');
            try{
                const res = await axios.post('http://localhost:5000/api/send-otp' , {email: formData.email});
                if(res.data.success){
                    setIsOtpSend(true);
                    setMessage('OTP sent to your email! Please check and enter the code.');
                }
            }catch(e){
                setMessage('Failed to send OTP. Please try again.');
            }
        }
    };

    const handleOtpBlur = async () => {
        if(formData.otp.length === 6 && isOtpSend && !isEmailVerified){
            setLoading(true);
            setMessage('Verifying your OTP, please wait...');
            try{
                const res = await axios.post('http://localhost:5000/api/verify-otp' , {
                    email: formData.email,
                    otp: formData.otp
                });
                if(res.data.success){
                    setIsEmailVerified(true);
                    setMessage('Your email has been successfully verified!');
                }
            }catch(e){
                setMessage(e.response?.data?.message || 'Incorrect OTP code. Please try again.');
            }
        }
    };

    const [formData, setFormData] = useState({
        firstName: "", 
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        userEmail: "",
        userPassword: "",
        otp: ""
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('userName');

        if(token && name){
            setIsLogin(true);
            setUserName(name);
        }
    } , []);

    let pageTitle = "Home";
    if (location.pathname === "/about") pageTitle = "About";
    else if (location.pathname === "/contact") pageTitle = "Contact";
    else if (location.pathname === "/addHymn") pageTitle = "Add Hymn";
    else if (location.pathname === "/viewallhymn") pageTitle = "View All Hymn";
    else if (location.pathname === "/createHymnSlot") pageTitle = "Create Slot";

    const firstLetter = userName ? userName.charAt(0).toUpperCase() : "";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setLoading(false);
    };

    //Register
    const handleRegisterSubmit = async(e) => {
        e.preventDefault();
        const validationErrors = await validateRegister(formData);
        setErrors(validationErrors);

        if(!isEmailVerified){
            setMessage('Please verify your email first!');
            return;
        }

        if (Object.keys(validationErrors).length === 0) {
            try{
                const response = await fetch('http://localhost:5000/api/register',{
                    method: 'POST',
                    headers: {
                        'Content-type':'application/json'
                    },
                    body: JSON.stringify({
                        fname: formData.firstName,
                        lname: formData.lastName,
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if(response.ok){
                    alert(data.message);

                    localStorage.setItem('token' , data.token);
                    localStorage.setItem('userId' , data.user.id);
                    localStorage.setItem('userName' , data.user.name);

                    setUserName(formData.firstName);
                    setIsLogin(true);
                    setIsRegisterOpen(false);
                    setHaveAccount(true);
                    setErrors({});
                    setMessage('');
                    setFormData({
                        password: "",
                        confirmPassword: "",
                        userEmail:"",
                        userPassword: ""
                    });
                }else{
                    alert(data.error || "Registration failed!");
                }
            }catch(e){
                console.log("Error connecting to server : " , e);
                alert("Server error. Please try again leter.");
            }
        }
        console.log('Errors : ' , errors);
    };

    //Login
    const handleLoginSubmit = async(e) => {
        e.preventDefault();
        const validationErrors = validateLogin(formData);
        setErrors(validationErrors);

        if(Object.keys(validationErrors).length === 0){
            try{
                const response = await fetch('http://localhost:5000/api/login' , {
                    method:'POST',
                    headers:{
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.userEmail,
                        password : formData.userPassword
                    })
                });

                const data = await response.json();

                if(data.success){
                    console.log("Successful login!");

                    localStorage.setItem('token' , data.token);
                    localStorage.setItem('userId' , data.user.id);
                    localStorage.setItem('userName' , data.user.name);

                    setUserName(data.user.name);
                    setHaveAccount(true);
                    setIsLogin(true);
                    setIsRegisterOpen(false);
                    setErrors({});

                    setFormData({
                        ...formData,
                        userEmail: '',
                        userPassword: ''
                    });
                }
                
                alert(data.message);

            }catch(e){
                console.log(e.message);
                alert("Server Error, Please try again later!");
            }
        }
    };

    return (
        <div>
            <div className="bannerBox"> 
                <div className="bannerShadow">
                    <div className="logoName">
                        <Link to="/"><img src="assets/logo-white.png" alt="HymnFlow logo"/></Link>
                    </div>
                    <div className="pageName">
                        <h1 id="pageName">{pageTitle}</h1>
                    </div>
                    <div className="linksName">
                        <ul>
                            <li className="navLink"><Link to="/">Home</Link></li>
                            <li className="navLink"><Link to="/about">About</Link></li>
                            <li className="navLink"><Link to="/contact">Contact</Link></li>
                            <li>
                                {isLogin ? (
                                    <div 
                                        className="userAvatar" 
                                        title={userName} 
                                        onClick={() => setIsClickAvatar(true)}>
                                        {firstLetter}
                                    </div>
                                ):(
                                    <button 
                                        className="registerBtn" 
                                        onClick={() => {
                                            setIsRegisterOpen(true);
                                            setErrors({});
                                        }}>
                                        Sign In
                                    </button>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {isRegisterOpen && (
                <div className="modalBox" onClick={() => {
                    setIsRegisterOpen(false);
                    setIsForgotPassword(false);
                }}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <h2>{registrationTitle}</h2>
                            <button 
                                className="closeBtn" 
                                onClick={() => {
                                    setIsRegisterOpen(false);
                                    setIsForgotPassword(false);
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {!haveAccount ? (
                            <form id="register-user-form" onSubmit={handleRegisterSubmit} noValidate>
                                {/* first name field */}
                                <div className="form-group">
                                    <input 
                                        name="firstName"
                                        id="userFname" 
                                        type="text" 
                                        placeholder="User First Name"
                                        value={formData.firstName}
                                        onChange={handleChange} 
                                    /><br />
                                    <small>{errors.firstName}</small>
                                </div>
                                {/* last name field */}
                                <div className="form-group">
                                    <input 
                                        name="lastName"
                                        id="userLname" 
                                        type="text" 
                                        placeholder="User Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange} 
                                    />
                                </div>
                                {/* email field */}
                                <div className="form-group">
                                    <input 
                                        name="email"
                                        id="userEmail" 
                                        type="email" 
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleEmailBlur}
                                    /><br />
                                    <small>{errors.email}</small>
                                </div>
                                {/* otp field */}
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        name="otp" 
                                        id="otp" 
                                        maxLength="6"
                                        value={formData.otp}
                                        disabled={!isOtpSend || isEmailVerified}
                                        onChange={handleChange}
                                        onBlur={handleOtpBlur}
                                        placeholder="OTP code"
                                    /><br/>
                                    <small>{errors.otp}</small>
                                    <div className="otpBox">
                                        {loading && <p className="otpMessage">{message}</p>}
                                    {isOtpSend && (
                                        <>
                                            {timer > 0 ? (
                                                <p className="resendOtpPara">Resend OTP : {Math.floor(timer/60)} : {timer%60 < 10 ? `0${timer%60}` : timer%60}</p>
                                            ):(
                                                <button 
                                                    type="button"
                                                    onClick={handleResendOtp}
                                                    display={!isResendOtp}>
                                                    Resend OTP
                                                </button>
                                            )}
                                        </>
                                    )}
                                    </div>
                                </div>
                                {/* password field */}
                                <div className="form-group">
                                    <input 
                                        name="password"
                                        id="userPass" 
                                        type="password" 
                                        placeholder="Password"
                                        onChange={handleChange} 
                                        value={formData.password}
                                    /><br />
                                    <small>{errors.password}</small>
                                </div>
                                {/* confirm password field */}
                                <div className="form-group">
                                    <input 
                                        name="confirmPassword"
                                        id="userConfirmPass" 
                                        type="password" 
                                        placeholder="Confirm Password"
                                        onChange={handleChange}
                                        value={formData.confirmPassword}
                                    /><br />
                                    <small>{errors.confirmPassword}</small>
                                </div>
                                {/* submit button and already have account field */}
                                <div className="formSubBtn">
                                    <button type="submit" className="submit-btn">Register</button>
                                    <p className="accHave" 
                                        onClick={() => { 
                                            setHaveAccount(!haveAccount);
                                            setErrors({});
                                            setRegistrationTitle('Log In'); 
                                        }}
                                    >Already have an account?
                                    </p>
                                </div>
                            </form>
                        ) : ( !isForgotPassword ? (
                            <form onSubmit={handleLoginSubmit} noValidate>
                                <div className="form-group">
                                    <input 
                                        name="userEmail"
                                        id="userEmail" 
                                        type="email" 
                                        placeholder="User email"
                                        value={formData.userEmail}
                                        onChange={handleChange} 
                                    /><br />
                                    <small>{errors.userEmail}</small>
                                </div>
                                <div className="form-group">
                                    <input 
                                        name="userPassword"
                                        id="userPass" 
                                        type="password" 
                                        placeholder="Password"
                                        onChange={handleChange} 
                                        value={formData.userPassword}
                                    /><br />
                                    <small>{errors.userPassword}</small>
                                </div>
                                <div className="formSubBtn">
                                    <button type="submit" className="submit-btn">Log In</button>
                                    <div className="clickOptionBox">
                                        <p 
                                        className="accHave" 
                                        onClick={() => { 
                                            setHaveAccount(!haveAccount); 
                                            setErrors({});
                                            setRegistrationTitle('Sign Up');
                                        }}>Create an account?
                                    </p>
                                    <p className="forgotPass" 
                                        onClick={() => { 
                                            setIsForgotPassword(true);
                                            setRegistrationTitle('Forgot Password');
                                        }}
                                    >
                                        Forgot password
                                    </p>
                                    </div>
                                </div>
                            </form>): (
                                <ForgotPassword
                                    setIsForgotPassword={setIsForgotPassword}
                                />
                            )
                        )}
                    </div>
                </div>
            )}

            {isClickAvatar && (
                <div className="avatarBox" onClick={() => setIsClickAvatar(false)}>
                    <div className="avatarContent" onClick={(e) => e.stopPropagation()}>
                        <button className="closeBtn" onClick={() => setIsClickAvatar(false)}>✕</button>
                        <h1 className="avatarHeader">Hello {userName},</h1>
                        <div className="avatar-content-box">
                            <img src="assets/profile-icon.png" alt="Profile Icon"/>
                            <p>View Profile</p>
                        </div>
                        <div 
                            className="avatar-content-box"
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('userId');
                                localStorage.removeItem('userName');
                                setIsRegisterOpen(false);
                                setIsLogin(false);
                                setIsClickAvatar(false);
                                setHaveAccount(true);
                                setUserName("");
                            }}
                        >
                            <img src="assets/logout-icon.png" alt="Log out Icon" />
                            <p>Log Out</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;