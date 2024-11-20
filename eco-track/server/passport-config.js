const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Make sure you require the User model

// Get a user by email (this function already exists)
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Get a user by ID
const getUserById = async (id) => {
  return await User.findById(id); // Find a user by their MongoDB ID
};

// Initialize Passport with strategies and user fetching functions
function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email); // Find user by email
    if (user == null) {
      return done(null, false, { message: 'No user with that email' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id)); // Serialize user by ID
  passport.deserializeUser((id, done) => {
    getUserById(id) // Use getUserById function to fetch user by ID
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });
}

module.exports = initialize;
