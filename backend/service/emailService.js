const nodemailer = require('nodemailer');
require('dotenv').config();

const otpStore = new Map();

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random()*900000);
};

const sendOTPEmail = async (userEmail) => {
    const otp = generateOTP();

    otpStore.set(userEmail , otp);

    setTimeout(() => {
        otpStore.delete(userEmail);
    } , 2*60*1000);

    const mailOption = {
        from: '"HymnFlow" , <${process.env.EMAIL_USER}>',
        to: userEmail,
        subject: 'HymnFlow - Email Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #121212; color: #ffffff; border-radius: 8px;">
            <h2 style="color: #4CAF50; margin-bottom: 10px;">HymnFlow Email Verification</h2>
            <p style="color: #cccccc;">Your OTP code for email verification is:</p>
            <div style="background-color: #1e1e1e; padding: 12px 24px; display: inline-block; letter-spacing: 6px; font-size: 24px; font-weight: bold; color: #FFD700; border-radius: 6px; margin: 15px 0;">
              ${otp}
            </div>
            <p style="color: #888888; font-size: 13px;">This code is valid for 2 minutes only.</p>
      </div>
    `
    }

    await transport.sendMail(mailOption);
    
    return true;
};

const verifyOTP = (userEmail , inputOTP) => {
    const savedOTP = otpStore.get(userEmail);

    if(!savedOTP){
        return {success : false , message: 'OTP has expired or was not provided. Please request a new OTP.'};
    }

    if(savedOTP === inputOTP){
        otpStore.delete(userEmail);
        return {success: true , message: 'Email verified successfully!'};
    }

    return {success : false , message : 'Incorrect OTP. Please enter the correct code.'};
};

module.exports = {sendOTPEmail , verifyOTP}