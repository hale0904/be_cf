const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // hash
    roleCode: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    staffCode: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    status: { type: Number, default: 1 }, // active, locked
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
