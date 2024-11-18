const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const cors = require('cors');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const User = require('./models/user'); // Import the User model

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

// Middleware setup
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow requests from React (localhost:3000)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
//require('./passport-config')(passport, getUserByEmail, getUserByEmailForDeserialization); // Pass the functions to passport-config
app.use(methodOverride('_method'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Passport setup (no need to manually define strategy or serialize/deserialize)
passport.serializeUser(User.serializeUser()); // Serialize the user to store in session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

// Define the function to get user by email for login (used in passport-config)
async function getUserByEmail(email) {
  const user = await User.findOne({ email: email });
  return user;
}

// Define the function to get user by email for deserialization (used in passport-config)
async function getUserByEmailForDeserialization(email) {
  const user = await User.findOne({ email: email });
  return user;
}

// Import Routes
const wasteRoutes = require('./routes/wasteRoutes');

// Routes
app.use('/api', wasteRoutes); // API route for waste data

// Authentication routes
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.json({ message: 'Please log in' });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next(); // If authenticated, allow access to the requested page
  res.status(401).json({ message: 'Please log in' }); // Otherwise, send a "Not Authorized" error
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/wasteform'); // Redirect to wasteform if already logged in
  next(); // Proceed to the next middleware for login
}

// Login route
app.post('/login', checkNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err); // Handle errors during authentication
      }
      if (!user) {
        // Authentication failed, redirect back to login with an error message
        return res.redirect('/login?error=' + encodeURIComponent(info.message || 'Authentication failed'));
      }
  
      req.logIn(user, (err) => {
        if (err) {
          return next(err); // Handle errors during session login
        }
  
        // Authentication successful, redirect to the /wasteform route
        res.redirect('/wasteform');
      });
    })(req, res, next);
});
  

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.json({ message: 'Please register' });
});

// Registration route
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body to check the email

    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    console.log('Existing User Check for Email:', req.body.email); // Log email being checked
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists', error: 'Email already exists' });
    }

    // Create a new user with the password already hashed (passport-local-mongoose handles hashing)
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // `passport-local-mongoose` handles hashing
    });

    // Save the user to the database
    await newUser.save();
    res.json({ message: 'Sign up successful!' }); // Success message after registration
  } catch (error) {
    console.error('Error during registration:', error); // Log error for debugging
    res.status(400).json({ message: 'Registration failed', error: error.message }); // Send the error message back
  }
});

app.delete('/logout', (req, res) => {
  req.logOut(); // Logout the user
  res.json({ message: 'Logged out successfully' });
});

// Middleware functions to check if the user is authenticated or not
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next(); // If authenticated, allow access
  res.redirect('/login'); // Otherwise, redirect to login page
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/'); // Redirect to home if already authenticated
  next(); // Proceed to the next middleware
}

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
