const mongoose = require('mongoose');

const menuDataSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // HR_LIST
    name: { type: String, required: true }, // Danh sách nhân sự
    path: { type: String, required: true }, // /hr/list
    icon: { type: String },
    order: { type: Number },

    // PHÂN CẤP MENU
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuData',
      default: null,
    },

    // GẮN VỚI FEATURE (CHA)
    featureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feature',
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuData', menuDataSchema);
