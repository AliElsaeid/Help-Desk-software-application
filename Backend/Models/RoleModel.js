const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  RoleName: { type: String, required: true },
});

const RoleModel = mongoose.model('Role', roleSchema);

module.exports = RoleModel;
