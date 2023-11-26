const mongoose = require('mongoose');
const Room = require('./RoomModel');
const User = require('./UserModel');

const chatMessageSchema = new mongoose.Schema({
  room: {
    type: Room.schema,
  },
  sender: {
    type: User.schema,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
