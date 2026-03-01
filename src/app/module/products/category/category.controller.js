const categoryService = require('./category.service');

// Get list parking map with filter and search
exports.getListCategory = async (req, res) => {
  try {
    const { status, keyword } = req.body;

    const data = await categoryService.getListCategory(status, keyword);
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
exports.getHrDetail = async (req, res) => {
  try {
    const { code } = req.body;
    const data = await hrService.getHrDetail(code);

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
exports.updateCategory = async (req, res) => {
  try {
    const payload = {
      ...req.body,
    };

    const result = await categoryService.updateCategory(payload);

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
