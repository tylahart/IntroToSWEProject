const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const cors = require('cors');
const methodOverride = require('method-override');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const wasteRoutes = require('./routes/wasteRoutes'); // Import wasteRoutes

// Load environment variables
require('dotenv').config();

// Initialize the Express app
const app = express(); // Initialize app here

// Initialize Passport
const initializePassport = require('./passport-config');
initializePassport(passport);

let refreshTokens = [];

// Middleware setup
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600000 },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Helper function to generate access tokens
function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET);
}

// Helper function to generate refresh tokens
function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  return refreshToken;
}

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Middleware to check if the user is not authenticated
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect('/home');
  }
  next();
}

// Routes
app.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });
  if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ message: 'Invalid refresh token' });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Refresh token verification failed' });
    const accessToken = generateAccessToken({ userId: user.userId, email: user.email });
    res.json({ accessToken });
  });
});

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

// Login route
app.post('/login', checkNotAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const accessToken = generateAccessToken({ userId: user._id.toString(), email: user.email });
    console.log('Token Payload:', { userId: user._id.toString(), email: user.email });

    const refreshToken = generateRefreshToken({ userId: user._id, email: user.email });

    // Log tokens before sending the response
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Generating token with payload:', { userId: user._id, email: user.email });

    res.json({ accessToken, refreshToken, message: 'Login successful!' }); // Send tokens to the client
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Register route
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.json({ message: 'Sign up successful!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
});

// Mount waste routes
app.use('/api', wasteRoutes); // Moved after app initialization

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
