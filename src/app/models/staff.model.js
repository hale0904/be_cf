const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      default: '',
    },
    userName: {
      type: String,
      trim: true,
      required: true,
      default: '',
    },
    password: {
      type: String,
      required: true,
      default: '',
    },
    dateOfBirth: {
      type: Date,
      required: true,
      default: null,
    },
    loactionName: {
      type: String,
      trim: true,
      required: true,
      default: '',
    },
    roleStaff: {
      type: Number,
      default: 0,
    },
    roleStaffName: {
      type: String,
      default: 'Nhân viên',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    phone: {
      type: Number,
      required: true,
      default: null,
    },
    typeOfPersonnel: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    typeOfContract: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    cccd: {
      type: Number,
      required: true,
      default: null,
    },
    status: {
      type: Number,
      default: 0,
    },
    statusName: {
      type: String,
      default: 'Tuyển dụng',
    },
    permissions: {
      features: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Feature',
        },
      ],
      menus: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuData',
        },
      ],
      canEdit: {
        type: Boolean,
        default: false, // có được sửa không
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);
