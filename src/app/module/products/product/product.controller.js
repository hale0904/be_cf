const productService = require('./product.service');

// Get list parking map with filter and search
exports.getListProduct = async (req, res) => {
  try {
    const { status, keyword } = req.body;

    const data = await productService.getListProduct(status, keyword);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get parking detail by code
exports.getProductDetail = async (req, res) => {
  try {
    const { code } = req.body;
    const data = await productService.getProductDetail(code);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Create or Update hr
exports.updateProduct = async (req, res) => {
  try {
    const payload = {
      ...req.body,
    };

    const result = await productService.updateProduct(payload);

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
