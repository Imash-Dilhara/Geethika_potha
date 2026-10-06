const jwt = require('jsonwebtoken');
const db = require('../db');
const express = require('express');
const router = express.Router();
const { sendOTPEmail , verifyOTP , sendRestPasswordLink } = require('../service/emailService');

router.post('/send-otp' , async(req , res) => {
    const {email} = req.body;

    if(!email){
        return res.status(400).json({success: false , message: 'Enter the email.'});
    }

    try{
        await sendOTPEmail(email);
        res.json({success: true , message: 'An OTP has been sent to your email address.'});
    }catch(e){
        console.error('Email error : ' , e);
        res.status(500).json({success: false , message: 'Could not send email. Please re-check your email address.'});
    }
});

router.post('/verify-otp' , async (req , res) => {
    const { email , otp } = req.body;

    if(!email || !otp){
        return res.status(400).json({success: false , message: 'Both Email and OTP are required.'});
    }

    const result = verifyOTP(email , otp);

    if(!result.success){
        return res.status(400).json(result);
    }

    return res.json(result);
});

router.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    const genericResponse = {
        success: true,
        message: "If this email is registered, a reset link has been sent."
    };

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const query = "SELECT r_no, password FROM register WHERE email = ?";

    db.query(query, [email], async (err, result) => {
        if (err) {
            console.error('Forgot password DB error:', err);
            return res.status(500).json({ success: false, message: 'Server error.' });
        }

        if (result.length === 0) {
            return res.json({
                success: false,
                message: "No account found with this email. Please check the email address or create a new account."
            });
        }

        const user = result[0];

        const token = jwt.sign(
            { id: user.r_no },
            process.env.RESET_SECRET + user.password,
            { expiresIn: '30m' }
        );

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

        try {
            await sendRestPasswordLink(email, resetLink);
        } catch (mailErr) {
            console.error('Reset email error:', mailErr);
        }

        res.json(genericResponse);
    });
});

router.post('/reset-password', (req, res) => {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
        return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    // Verify karanna kalin user wa hoyaganna token eke id eka kiyawanawa
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id) {
        return res.status(400).json({ success: false, message: 'Invalid reset link.' });
    }

    db.query("SELECT r_no, password FROM register WHERE r_no = ?", [decoded.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Server error.' });
        }

        if (result.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid reset link.' });
        }

        const user = result[0];

        try {
            // Signature eka, expiry eka, password wenas wela naththa kiyala okkoma check wenawa
            jwt.verify(token, process.env.RESET_SECRET + user.password);
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: 'This reset link is invalid or has expired.'
            });
        }

        db.query("UPDATE register SET password = ? WHERE r_no = ?", [new_password, user.r_no], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Updating error!' });
            }
            res.json({ success: true, message: 'Password updated successfully!' });
        });
    });
});

module.exports = router;