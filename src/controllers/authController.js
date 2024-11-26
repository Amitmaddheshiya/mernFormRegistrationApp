const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/registers");

// Render Login Page
exports.getLoginPage = (req, res) => {
    res.render("views/login");
};

// Render Forgot Password Page
exports.getForgotPasswordPage = (req, res) => {
    res.render("forgot-password"); // Avoid nesting paths unnecessarily
};

// Handle Forgot Password
exports.postForgotPassword = async (req, res) => {
    const { email } = req.body; // Only email is used, no need for username
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render("forgot-password", { error: "Invalid email address!" });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:5000/change-password/${resetToken}`;
        const emailContent = `
            <p>Hello ${user.firstname},</p>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>If you did not request this, please ignore this email.</p>
        `;

        // Send email
        await transporter.sendMail({
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset Request",
            html: emailContent,
        });

        res.render("forgot-password", { success: "Password reset email sent! Check your inbox." });
    } catch (error) {
        console.error("Error in forgot-password:", error);
        res.render("forgot-password", { error: "Something went wrong. Please try again later." });
    }
};

// Render Change Password Page
exports.getChangePasswordPage = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.send("Invalid or expired token.");
        }

        res.render("change-password", { email: user.email });
    } catch (error) {
        console.error("Error in fetching user:", error);
        res.status(500).send("Internal server error.");
    }
};

// Handle Change Password
exports.postChangePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.send("User not found.");
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.redirect("/login");
    } catch (error) {
        console.error("Error in updating password:", error);
        res.status(500).send("Internal server error.");
    }
};