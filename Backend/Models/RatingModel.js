const mongoose = require('mongoose');
const Ticket = require('./TicketModel');
const User = require('./UserModel');

const ratingsSchema = new mongoose.Schema({
  ticket: {
    type: Ticket.schema,
  },
  user: {
    type: User.schema,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: String,
});

const Ratings = mongoose.model('Ratings', ratingsSchema);

module.exports = Ratings;
