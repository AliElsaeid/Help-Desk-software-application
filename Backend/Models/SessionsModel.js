const mongoose = require('mongoose');
const User = require('./UserModel');

const sessionsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
