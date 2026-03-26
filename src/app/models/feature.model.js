const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // "HR", "PAYROLL"
    name: { type: String, required: true }, // "Nhân sự"
    isActive: { type: Boolean, default: true },
    listMenu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuData',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feature', featureSchema);
