const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const cors = require('cors');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const User = require('./models/user'); // Import the User model
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is required

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Initialize Passport
const initializePassport = require('./passport-config');
initializePassport(passport);

// Middleware setup
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow requests from React (localhost:3000)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600000 }, // Set appropriate maxAge and other cookie settings
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
const wasteRoutes = require('./routes/wasteRoutes');
app.use('/api', wasteRoutes); // API route for waste data

// Authentication routes
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.json({ message: 'Please log in' });
});

// Login route
app.post('/login', checkNotAuthenticated, async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: 'Email or password is incorrect', error: 'Email or password is incorrect' });
    }

    // Compare the input password with the stored hashed password
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error during password comparison', error: err.message });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Email or password is incorrect', error: 'Email or password is incorrect' });
      }

      // If the passwords match, log the user in
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error logging in', error: err.message });
        }
        res.json({ message: 'Login successful!' });
      });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Register route
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists', error: 'Email already exists' });
    }

    // Create a new user with the password already hashed (passport-local-mongoose handles hashing)
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword, // Hash password before saving
    });

    // Save the user to the database
    await newUser.save();
    res.json({ message: 'Sign up successful!' }); // Success message after registration
  } catch (error) {
    console.error('Error during registration:', error); // Log error for debugging
    res.status(400).json({ message: 'Registration failed', error: error.message }); // Send the error message back
  }
});

// Logout route
app.delete('/logout', (req, res) => {
  req.logout((err) => { // Use the correct method to logout
    if (err) {
      return res.status(500).json({ message: 'Error during logout', error: err.message });
    }
    req.session.destroy(() => { // Ensure the session is destroyed
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Middleware functions to check if the user is authenticated or not
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      // If the user is already authenticated, redirect them to wasteform (or another page)
      return res.redirect('/wasteform');
    }
    next(); // Proceed to the login page if not authenticated
  }

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
