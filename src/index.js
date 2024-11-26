const express = require("express");
const path = require("path");
const hbs = require("hbs");
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/authMiddleware');
const connectDB = require('./db/conn');
const errorHandler = require('./middlewares/errorMiddleware');
const RegisterRoutes = require('./routes/registerRoutes');
const LoginRoutes = require('./routes/loginRoutes');
const LogoutRoutes = require('./routes/logoutRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');



require("dotenv").config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware for data parser
app.use(express.json());

// Middleware for form data
app.use(express.urlencoded({ extended: true }));

// Middleware for cookies
app.use(cookieParser());


//setup for handlebars
const static_path = path.join(__dirname, "../public");
const tempalte_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", tempalte_path);
hbs.registerPartials(partials_path);

//routes
app.get("/", authMiddleware, (req, res) =>  res.render("index"));

app.get('/login', (req, res) => res.render('login')); // Login Page
app.get('/signup', (req, res) => res.render('register'));
app.get('/secret', authMiddleware, (req, res) => res.render('secret'));
app.get("/forgot-password", (req, res) => res.render('forgot-password'));

app.use('/register', RegisterRoutes);
app.use('/logins', LoginRoutes);
app.use('/logout', authMiddleware, LogoutRoutes);
app.use('/forgot-password', forgotPasswordRoutes);


// Error handling middleware
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
