const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  TicketID: { type: mongoose.Schema.Types.ObjectId, ref: 'Tickets' },
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  Rating: { type: Number, required: true },
  Comment: String,
});

const RatingsModel = mongoose.model('Ratings', ratingSchema);

module.exports = RatingsModel;
