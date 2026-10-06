import React,{ useState } from "react";
import { validateEmail } from '../utils/creat-account-validation';
import '../css/forgotPass.css';

function ForgotPassword({ setIsForgotPassword }){

    const [errors, setErrors] = useState({});
    const [email , setEmail] = useState('');
    const [message , setMessage] = useState('');

    const handleChange = (e) => {
            setEmail(e.target.value);
    };

    const submitForgotPassword = async (e) => {
        e.preventDefault();

        const emailErrors = validateEmail(email);
        setErrors(emailErrors);

        if(Object.keys(emailErrors).length === 0){
            try{
                const response = await fetch('http://localhost:5000/api/allemail', {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email
                    })
                });

                const data = await response.json();

                if(data === true){
                    alert("Email exists in the database.");
                    setIsForgotPassword(false);
                }else{
                    setMessage("Email Not found! Please check your email or create a new account.");
                }

                
            }catch(e){
                console.log(e.message);
                alert("Error of the forgot password server, Please try again later!");
            }
        }
    }

    return (
        <>
            <form onSubmit={submitForgotPassword} noValidate>
                <div className="form-group">
                    <input 
                        name="userEmail"
                        id="userEmail" 
                        type="email" 
                        placeholder="User email"
                        value={email}
                        onChange={handleChange}
                    /><br/>
                    <small>{errors.userEmail || message}</small>
                </div>
                <div className="formSubBtn">
                    <button type="submit" className="submit-btn">Reset Password</button>
                </div>
                <div className="formSubBtn">
                    <p 
                        onClick={() => setIsForgotPassword(false)}
                        className="backToLogin"
                    >
                        Back to the Login page
                    </p>
                </div>
            </form>
        </>
    );
}

export default ForgotPassword;