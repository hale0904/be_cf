const featureService = require('./feature.service');

exports.getListFeature = async (req, res) => {
  try {
    const data = await featureService.getListFeature();
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

// Create or Update feature
exports.updateFeature = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      adminCode: req.admin?.code, // lấy từ token (nếu có auth)
    };

    const result = await featureService.updateFeature(payload);

    return res.status(200).json({
      success: true,
      message: result.isCreate
        ? 'Tạo tính năng thành công'
        : 'Cập nhật tính năng thành công',
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
