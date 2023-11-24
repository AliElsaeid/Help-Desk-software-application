const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Username: { type: String, unique: true, required: true },
  Password: { type: String, required: true },
  RoleID: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  FirstName: String,
  LastName: String,
  Email: { type: String, unique: true },
});

const UsersModel = mongoose.model('Users', userSchema);

module.exports = UsersModel;
