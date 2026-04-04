const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const express = require("express");
const router = express.Router();
router.use(express.json());
require("dotenv").config();
const sendOTP = (email, validate) => {
    return new Promise((resolve, reject) => {
        const otp = randomstring.generate({ length: 6, charset: "numeric" });
        const frontName = email.match(/^[a-zA-Z]+/)[0];
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        const resultBody =
            validate === "Verification"
                ? `
    <p>Hello ${frontName}!</p>
    <p>Welcome to the Training Data Portal! Verify your account using the OTP provided below:</p>
    <p><b>Verification OTP: ${otp} 🔒</b></p>
    <p>Best regards,</p>
    <p>Training Co-ordinator</p> 
    <p>GNDEC Ludhiana</p>`
                : `<p>Hello ${frontName}! </p>
    <p>We received a request to reset your password for your Training Data Portal account. Use the OTP provided below to proceed with the reset:</p>
    <p><b> Reset Password: ${otp} </b></p>
    <p>If you didn't request a password reset, please ignore this email. Your account is safe, and no action is required.</p>
    <p>For any assistance, contact [Support Email/Phone]. We're here to help you!</p>
    <p>Best regards,</p>
    <p>Training Co-ordinator</p>
    <p>GNDEC Ludhiana</p>`;

        const resultSubject =
            validate === "Verification"
                ? "🏅 Training Data Portal: Verify Your Account 🏅"
                : "🔑 Password Reset: Training Data Portal  🔑";
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: resultSubject,
            html: resultBody,
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                reject({ success: false, response: "Failed to send OTP." });
            } else {
                resolve({ success: true, response: info.response, otp }); // Include otp in the resolved object
            }
        });
    });
};

module.exports = sendOTP;
