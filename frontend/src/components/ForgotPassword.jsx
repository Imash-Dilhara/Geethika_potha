import React, { useState } from "react";
import { validateEmail } from '../utils/creat-account-validation';
import axios from "axios";
import '../css/forgotPass.css';

function ForgotPassword({ setIsForgotPassword }) {

    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const submitForgotPassword = async (e) => {
        e.preventDefault();
        setMessage('');

        const emailErrors = validateEmail(email);
        setErrors(emailErrors);
        if (Object.keys(emailErrors).length !== 0) return;

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            console.log(err.message);
            setMessage("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

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
                    /><br />
                    <small>{errors.userEmail || message}</small>
                </div>
                <div className="formSubBtn">
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                </div>
                <div className="formSubBtn">
                    <p onClick={() => setIsForgotPassword(false)} className="backToLogin">
                        Back to the Login page
                    </p>
                </div>
            </form>
        </>
    );
}

export default ForgotPassword;