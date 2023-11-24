const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  Category: { type: String, required: true },
  SubCategory: { type: String, required: true },
  Priority: { type: Number, required: true },
  Status: { type: String, required: true },
  AgentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  Description: String,
  Resolution: String,
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  ClosedAt: Date,
});

const TicketsModel = mongoose.model('Tickets', ticketSchema);

module.exports = TicketsModel;
