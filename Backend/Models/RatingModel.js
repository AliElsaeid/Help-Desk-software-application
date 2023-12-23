const mongoose = require('mongoose');
const Ticket = require('./TicketsModel');


const ratingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },


  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  },
  agent:String,

 
  rating: {
    type: Number,
    required: true,
  },
  comment: String,
});

const Ratings = mongoose.model('Ratings', ratingsSchema);

module.exports = Ratings;
