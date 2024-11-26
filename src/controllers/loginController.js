const Register = require('../models/registers');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

// Create Register (Signup)
const createLogin = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const useremail = await Register.findOne({ email });
     
      // Compare the entered password with the hashed password in the database
     const isMatch = await bcrypt.compare(password, useremail.password);

      // Generate token
      const token = await useremail.generateAuthToken();
      console.log(token);

      // Set cookie
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true
    });

     // If passwords match, render the home page
     if (isMatch) {
        res.status(200).render("index");
     }else{
         return res.status(400).send("Invalid email or password");
     } 

    }catch (error) {
        console.error(error);
      res.status(500).send("invalid login details");
    }
};

// Module exports in another way
module.exports = {
    createLogin,
};  