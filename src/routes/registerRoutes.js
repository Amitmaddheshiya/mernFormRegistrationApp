const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');


// Define routes for courses
router.post('/', registerController.createRegister); // Create a course
router.get('/', registerController.getRegister);     // Get all courses
router.get('/:id', registerController.getRegisterById); // Get course by ID
router.put('/:id', registerController.updateRegister); // Update course
router.delete('/:id', registerController.deleteRegister); // Delete course


module.exports = router;

