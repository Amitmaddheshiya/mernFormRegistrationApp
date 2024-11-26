const Register = require('../models/registers');
const bcrypt = require("bcrypt");


// Create Register (Signup)
const createRegister = async (req, res) => {
    try {
        const { firstname, lastname, email, gender, phone, age, password, confirmPassword } = req.body;

        // Password confirmation validation
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }

        // Check if user already exists by email
        const existingUserByEmail = await Register.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).send("Email already registered");
        }

        // Check if user already exists by phone
        const existingUserByPhone = await Register.findOne({ phone });
        if (existingUserByPhone) {
            return res.status(400).send("Phone number already registered");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);

        // Create a new user with hashed password
        const registerEmployee = new Register({
            firstname,
            lastname,
            email,
            gender,
            phone,
            age,
            password: hashedPassword,  // Use hashed password
            confirmpassword: hashedConfirmPassword // You may choose not to store this or hash it too
        });

         // Generate token
        const token = await registerEmployee.generateAuthToken();
        console.log(token);

        // Set cookie
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        });
        

        // Save the user to the database
        await registerEmployee.save();
        console.log("User registered successfully");
        res.status(201).render("index"); // Redirect to the home page after successful registration
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).send("Internal Server Error");
    }
};



// Get all courses
const getRegister = async (req, res) => {
    try {
        const registers = await Register.find();
        res.json(registers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a course by ID
const getRegisterById = async (req, res) => {
    try {
        const register = await Register.findById(req.params.id);
        if (!register) return res.status(404).json({ message: 'Course not found' });
        res.json(register);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a course
const updateRegister = async (req, res) => {
    try {
        const register = await Register.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!register) return res.status(404).json({ message: 'Course not found' });
        res.json(register);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a course
const deleteRegister = async (req, res) => {
    try {
        const register = await Register.findByIdAndDelete(req.params.id);
        if (!register) return res.status(404).json({ message: 'Course not found' });
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Module exports in another way
module.exports = {
    createRegister,
    getRegister,
    getRegisterById,
    updateRegister,
    deleteRegister
};      
