const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  RoomName: { type: String, required: true },
  CreatedAt: { type: Date, default: Date.now },
  Description: String,
});

const RoomsModel = mongoose.model('Rooms', roomSchema);

module.exports = RoomsModel;
