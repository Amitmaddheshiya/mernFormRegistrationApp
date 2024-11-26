const jwt = require('jsonwebtoken');
const Register = require('../models/registers');

// Middleware for verifying JWT token
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;// JWT from cookies

        if (!token) {
            // Redirect to login if no token is found
            return res.redirect('/login');
        }

        const verifyUser = jwt.verify(token, process.env.JWT_PRIVATE_KEY);// Verify JWT
        const rootUser = await Register.findOne({ 
            _id: verifyUser._id,
             "tokens.token": token 
            });// Check user existence in database

        if (!rootUser) {
          throw new Error('User not found');  
        } else {
            req.user = rootUser;// Attach user to the request object
            req.token = token;// Attach token to the request object
            next();// Proceed to the next handler
        }
    }catch (error) {
     res.status(401).send(error);   
    }
};

module.exports = authMiddleware;
