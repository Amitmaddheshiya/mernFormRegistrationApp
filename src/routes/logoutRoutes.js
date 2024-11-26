const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');

// Define routes for logout
router.get('/', logoutController.getLogout); // Create a logout

module.exports = router;

