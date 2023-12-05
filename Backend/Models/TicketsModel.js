const mongoose = require('mongoose');
const User = require('./UserModel');


const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  subCategory: String,
  priority: String,
  status: String,
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  resolution: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  closedAt: Date,
  ratings: { type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
