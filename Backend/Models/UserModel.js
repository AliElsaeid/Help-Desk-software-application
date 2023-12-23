const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }]

});

const User = mongoose.model('User', userSchema);

module.exports = User;
