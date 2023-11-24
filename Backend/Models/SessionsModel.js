const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  Token: { type: String, required: true },
  ExpiryTime: { type: Date, required: true },
});

const SessionsModel = mongoose.model('Sessions', sessionSchema);

module.exports = SessionsModel;
