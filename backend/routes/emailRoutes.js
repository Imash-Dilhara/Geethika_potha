const express = require('express');
const router = express.Router();
const { sendOTPEmail , verifyOTP } = require('../service/emailService');

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

router.post('verify-otp' , async (req , res) => {
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

module.exports = router;