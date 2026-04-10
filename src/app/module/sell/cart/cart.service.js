const cartModel = require('../../../models/cart.model');
const userModel = require('../../../models/user.model');
const productModel = require('../../../models/product.model');

const STATUS_CART = {
  0: 'Đã hủy',
  1: 'Đang chọn sản phẩm',
  2: 'Đã ra hóa đơn',
};

exports.getListCart = async (keyword) => {
  const filter = {};

  if (keyword && keyword.trim() !== '') {
    const regex = new RegExp(keyword.trim(), 'i');

    filter.$or = [{ code: regex }];
  }

  const cart = await cartModel
    .find(filter)
    .select('code userId products totalAmount status statusName createdAt')
    .populate('userId', 'code fullName email phone')
    .populate('products.productId', 'code name price image')
    .sort({ createdAt: -1 });

  return cart;
};

exports.updateCart = async (payload) => {
  const { code, userCode, productId, quantity = 1, status } = payload;

  // Create
  if (!code || Number(code) === 0) {
    if (!userCode || !productId) {
      throw new Error('Thiếu thông tin');
    }

    const user = await userModel.findOne({ code: userCode });
    if (!user) {
      throw new Error('Tài khoản không tồn tại');
    }

    const product = await productModel.findOne({ code: productId });
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    const finalStatus =
      status !== undefined && status !== null ? Number(status) : 0;

    const totalPrice = product.price * quantity;

    const listProduct = [
      {
        productId: product._id,
        quantity,
        price: product.price,
        totalPrice,
      },
    ];

    const total = listProduct.reduce((sum, item) => sum + item.totalPrice, 0);

    const lastCart = await cartModel
      .findOne({ code: { $regex: /^CART\d+$/ } })
      .sort({ code: -1 })
      .select('code');

    let newNumber = 1;

    if (lastCart) {
      const currentNumber = parseInt(lastCart.code.replace('CART', ''), 10);
      newNumber = currentNumber + 1;
    }

    const newCode = `CART${String(newNumber).padStart(3, '0')}`;

    const cart = await cartModel.create({
      code: newCode,
      userId: user._id,
      products: listProduct,
      totalAmount: total,
      status: finalStatus,
    });

    return { isCreate: true, data: cart };
  }

  // Update
  const cartUpdate = await cartModel.findOne({ code });
  if (!cartUpdate) {
    throw new Error('Mã giỏ hàng không tồn tại');
  }

  const product = await productModel.findOne({ code: productId });
  if (!product) {
    throw new Error('Sản phẩm không tồn tại');
  }

  const existProductIndex = cartUpdate.products.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );

  if (existProductIndex !== -1) {
    cartUpdate.products[existProductIndex].quantity += quantity;
    cartUpdate.products[existProductIndex].totalPrice =
      cartUpdate.products[existProductIndex].quantity *
      cartUpdate.products[existProductIndex].price;
  } else {
    cartUpdate.products.push({
      productId: product._id,
      quantity,
      price: product.price,
      totalPrice: product.price * quantity,
    });
  }

  if (status !== undefined && status !== null) {
    const newStatus = Number(status);
    cartUpdate.status = newStatus;
  }

  cartUpdate.totalAmount = cartUpdate.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  await cartUpdate.save();

  return { isCreate: false, data: cartUpdate };
};

exports.deleteProductInCart = async (code, productId) => {
  if (!code || !productId) {
    throw new Error('Thiếu thông tin');
  }

  const cart = await cartModel.findOne({ code });

  if (!cart) {
    throw new Error('Giỏ hàng không tồn tại');
  }

  const product = await productModel.findOne({ code: productId });

  if (!product) {
    throw new Error('Sản phẩm không tồn tại');
  }

  const productIndex = cart.products.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );

  if (productIndex === -1) {
    throw new Error('Sản phẩm không tồn tại trong giỏ hàng');
  }

  cart.products.splice(productIndex, 1);

  cart.totalAmount = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  if (cart.products.length === 0) {
    cart.status = 0;
    cart.statusName = STATUS_CART[0];
  }

  await cart.save();

  return {
    success: true,
    message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
    data: cart,
  };
};
