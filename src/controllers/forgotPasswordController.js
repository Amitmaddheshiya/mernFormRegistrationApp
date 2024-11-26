const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Register = require('../models/registers');

// Step 1: Handle Forgot Password Form Submission
const handleForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordLink = `${req.protocol}://${req.get('host')}/forgot-password/reset/${resetToken}`;
        user.resetToken = resetToken;
        user.resetTokenExpire = Date.now() + 3600000; // 1-hour expiration
        await user.save();

        // Send Email
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,  // Make sure the port is correct for your use case
            secure: true,  // Set to true for port 465 (SSL)
            auth: {
                user: process.env.EMAIL_USER,  // Use the email from your .env
                pass: process.env.EMAIL_PASS,  // Use the app password (if 2FA enabled)
            },
            tls: {
                rejectUnauthorized: false,  // This will help avoid SSL errors
            }
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"Amit Maddheshiya" <${process.env.EMAIL_USER}>`, // sender address
            to: user.email, // list of receivers
            subject: "Password Reset Request", // Subject line
            text: `You requested a password reset. Click the following link to reset your password: ${resetPasswordLink}`, // plain text body
            html: `<p>You requested a password reset. Click the following link to reset your password:</p><a href="${resetPasswordLink}">${resetPasswordLink}</a>`, // html body
        });

        res.status(200).send('Password reset email sent successfully. Check your email for the reset link. Email ID: ' + info.messageId);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Step 2: Render Reset Password Page
const renderResetPasswordPage = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await Register.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).send('Invalid or expired token');
        }
        res.render('reset-password', { token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Step 3: Handle New Password Submission
const handleResetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    try {
        if (newPassword !== confirmNewPassword) {
            return res.status(400).send('Passwords do not match');
        }

        const user = await Register.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).send('Invalid or expired token');
        }

        // Hash new password and update in DB
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();
        res.status(200).render('login');
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    handleForgotPassword,
    renderResetPasswordPage,
    handleResetPassword
};
