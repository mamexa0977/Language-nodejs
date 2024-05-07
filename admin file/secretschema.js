const mongoose = require('mongoose');

const secretKeySchema = new mongoose.Schema({
  key: {type: String, require: true},
});

const SecretKey = mongoose.model('SecretKey', secretKeySchema);

module.exports = SecretKey;
