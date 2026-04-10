const cartService = require('./cart.service');

exports.getListCart = async (req, res) => {
  try {
    const { keyword } = req.body;

    const data = await cartService.getListCart(keyword);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const payload = {
      ...req.body,
    };

    const result = await cartService.updateCart(payload);

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProductInCart = async (req, res) => {
  try {
    const { code, productId } = req.body; // DTO[]

    const result = await cartService.deleteProductInCart(code, productId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
