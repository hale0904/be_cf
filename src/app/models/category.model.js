const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // TS, CF...
    name: { type: String, required: true }, // Trà sữa, Cafe
    description: { type: String, default: '' },
    status: { type: Number, default: 1 }, // 1: active, 0: inactive
    statusName: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
