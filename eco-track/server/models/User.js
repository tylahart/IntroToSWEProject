const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Create a schema for the User model
const userSchema = new mongoose.Schema({
  //user id
  userId : { type: mongoose.Schema.Types.ObjectId , default: () => new mongoose.Types.ObjectId() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Optional if using passport-local-mongoose
});

// Use passport-local-mongoose, and specify that `email` is the username
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' }); // Specify email as the username field

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
