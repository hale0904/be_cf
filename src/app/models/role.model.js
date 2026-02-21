const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  code: { type: String, unique: true }, // ADMIN, HR, STAFF
  name: { type: String },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
});

module.exports = mongoose.model('Role', roleSchema);
