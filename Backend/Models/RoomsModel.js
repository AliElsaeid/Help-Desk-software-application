const mongoose = require('mongoose');
const Ticket = require('./TicketsModel'); // Assuming you have a Ticket model
const ChatMessage = require('./ChatMessagesModel');

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: String,

  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }],
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
