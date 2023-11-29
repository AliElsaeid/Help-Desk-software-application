const mongoose = require('mongoose');
const User = require('./UserModel');
const Sessions = require('./SessionsModel');

const userActivityLogSchema = new mongoose.Schema({
  user: {
    type: User.schema,
  },
  session: {
    type: Sessions.schema,
  },
  activityType: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserActivityLog = mongoose.model('UserActivityLog', userActivityLogSchema);

module.exports = UserActivityLog;
