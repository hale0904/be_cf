const mongoose = require('mongoose');

const typeHrSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  typeData: { type: Number, required: true },
  status: { type: Number, required: true },
  statusName: { type: String },
});

module.exports = mongoose.model('TypeHr', typeHrSchema);
