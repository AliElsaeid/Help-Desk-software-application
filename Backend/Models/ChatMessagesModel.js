const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  RoomID: { type: mongoose.Schema.Types.ObjectId, ref: 'Rooms' },
  SenderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  Content: { type: String, required: true },
  Timestamp: { type: Date, default: Date.now },
});

const ChatMessagesModel = mongoose.model('ChatMessages', chatMessageSchema);

module.exports = ChatMessagesModel;
