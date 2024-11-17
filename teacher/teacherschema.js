const mongoose = require('mongoose');
// made by mohammed
const teacherSchema = new mongoose.Schema({
username: { type: String, required: true },
  password: { type: String, required: true },
  userKey: { type: String, },
  language: { type: String },
  imageurl: { type: String },     
  registrationDate: { type: Date, default: Date.now } 
});
teacherSchema.statics.getAllUsers = async function () {
  return this.find({}, 'username');
};


const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
