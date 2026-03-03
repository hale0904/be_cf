const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    categoryCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: { type: String, require: true },
    description: { type: String, require: true },
    status: { type: Number, default: 1 },
    statusName: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
