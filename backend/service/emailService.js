require('dotenv').config();

const otpStore = new Map();

// Brevo HTTP API eken email yawanawa (Render free tier eke SMTP block nisa)
const sendEmail = async (to, subject, html) => {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: { name: 'HymnFlow', email: process.env.EMAIL_USER },
            to: [{ email: to }],
            subject,
            htmlContent: html
        })
    });

    if (!res.ok) {
        throw new Error(`Brevo error: ${await res.text()}`);
    }
};

const generateOTP = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};

const sendOTPEmail = async (userEmail) => {
    const otp = generateOTP();

    otpStore.set(userEmail, otp);

    setTimeout(() => {
        otpStore.delete(userEmail);
    }, 2 * 60 * 1000);

    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #121212; color: #ffffff; border-radius: 8px;">
            <h2 style="color: #4CAF50; margin-bottom: 10px;">HymnFlow Email Verification</h2>
            <p style="color: #cccccc;">Your OTP code for email verification is:</p>
            <div style="background-color: #1e1e1e; padding: 12px 24px; display: inline-block; letter-spacing: 6px; font-size: 24px; font-weight: bold; color: #FFD700; border-radius: 6px; margin: 15px 0;">
                ${otp}
            </div>
            <p style="color: #888888; font-size: 13px;">This code is valid for 2 minutes only.</p>
        </div>
    `;

    await sendEmail(userEmail, 'HymnFlow - Email Verification Code', html);

    return true;
};

const verifyOTP = (userEmail, inputOTP) => {
    const savedOTP = otpStore.get(userEmail);

    if (!savedOTP) {
        return { success: false, message: 'OTP has expired or was not provided. Please request a new OTP.' };
    }

    if (savedOTP === inputOTP) {
        otpStore.delete(userEmail);
        return { success: true, message: 'Email verified successfully!' };
    }

    return { success: false, message: 'Incorrect OTP. Please enter the correct code.' };
};

const sendRestPasswordLink = async (userEmail, resetLink) => {
    const html = `
        <h2>Reset your password</h2>
        <p>Click the button below to set a new password. This link expires in 30 minutes.</p>
        <p><a href="${resetLink}" style="background:#4b4bbd;color:#fff;padding:10px 20px;border-radius:20px;text-decoration:none;">Reset Password</a></p>
        <p>If you didn't request this, you can ignore this email.</p>`;

    await sendEmail(userEmail, 'Reset your HymnFlow password', html);
};

module.exports = { sendOTPEmail, verifyOTP, sendRestPasswordLink };