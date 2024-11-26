const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Define routes for Login
router.post('/', loginController.createLogin); // Create a login


module.exports = router;

