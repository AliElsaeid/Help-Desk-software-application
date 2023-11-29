const mongoose = require('mongoose');
const User = require('./UserModel');

const sessionsSchema = new mongoose.Schema({
  user: {
    type: User.schema,
  },
  token: {
    type: String,
    required: true,
  },
  expiryTime: {
    type: Date,
    required: true,
  },
});

const Sessions = mongoose.model('Sessions', sessionsSchema);

module.exports = Sessions;
