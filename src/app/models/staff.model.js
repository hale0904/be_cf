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
    // roleStaff: {
    //   type: Number,
    //   default: 0,
    // },
    // roleStaffName: {
    //   type: String,
    //   default: 'Nhân viên',
    // },
    typeOfPosition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TypeHr',
      required: true,
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
    typeOfPersonnelCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TypeHr',
      required: true,
    },
    typeOfContract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TypeHr',
      required: true,
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
    userCode: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);
