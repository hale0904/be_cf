const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
      // 0: Đã hủy
      // 1: Đang chọn sản phẩm
      // 2: Đã thanh toán
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
