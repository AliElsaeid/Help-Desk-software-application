const mongoose = require('mongoose');
const Role = require('./RoleModel.js');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Role.schema,
    
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports  = mongoose.model('User', userSchema);

module.exports.Schema = userSchema;
