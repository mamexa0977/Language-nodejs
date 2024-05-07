const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  language: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now } 
});
userSchema.statics.getAllUsers = async function () {
  return this.find({}, 'email language');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
