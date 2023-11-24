const mongoose = require('mongoose');

const userActivityLogSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  SessionID: { type: mongoose.Schema.Types.ObjectId, ref: 'Sessions' },
  ActivityType: { type: String, required: true },
  Timestamp: { type: Date, default: Date.now },
});

const UserActivityLogModel = mongoose.model('UserActivityLog', userActivityLogSchema);

module.exports = UserActivityLogModel;
