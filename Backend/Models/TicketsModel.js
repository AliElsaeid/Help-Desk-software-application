const mongoose = require('mongoose');
const User = require('./UserModel');

const ticketSchema = new mongoose.Schema({
  user: {
    type: User.schema,
    required: true,
  },
  category: String,
  subCategory: String,
  priority: {
    type: Number,
    required: true,
  },
  status: String,
  agent: {
    type: User.schema,
  },
  description: String,
  resolution: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: Date,
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
