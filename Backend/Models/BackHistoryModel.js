const mongoose = require('mongoose');

const backupHistorySchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  BackupDate: { type: Date, default: Date.now },
  BackupLocation: { type: String, required: true },
  Description: String,
});

const BackupHistoryModel = mongoose.model('BackupHistory', backupHistorySchema);

module.exports = BackupHistoryModel;
