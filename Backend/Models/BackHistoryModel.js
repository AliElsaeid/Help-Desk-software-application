const mongoose = require('mongoose');
const User = require('./UserModel');

const backupHistorySchema = new mongoose.Schema({
  user: {
    type: User.schema,
  },
  backupDate: {
    type: Date,
    default: Date.now,
  },
  backupLocation: {
    type: String,
    required: true,
  },
  description: String,
});

const BackupHistory = mongoose.model('BackupHistory', backupHistorySchema);

module.exports = BackupHistory;
