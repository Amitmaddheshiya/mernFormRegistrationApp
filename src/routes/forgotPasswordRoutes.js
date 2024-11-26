const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');

// Route to handle forgot password form submission
router.post('/', forgotPasswordController.handleForgotPassword);

// Route to reset password (redirected from email link)
router.get('/reset/:token', forgotPasswordController.renderResetPasswordPage);

// Route to handle new password submission
router.post('/reset/:token', forgotPasswordController.handleResetPassword);

module.exports = router;
