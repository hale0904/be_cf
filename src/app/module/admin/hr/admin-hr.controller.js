const hrService = require('./admin-hr.service');

// Get list parking map with filter and search
exports.getListHr = async (req, res) => {
  try {
    const { status, keyword } = req.body;

    const data = await hrService.getListHr(status, keyword);
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
exports.updateHr = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      adminCode: req.admin?.code, // lấy từ token (nếu có auth)
    };

    const result = await hrService.updateHr(payload);

    return res.status(200).json({
      success: true,
      message: result.isCreate
        ? 'Tạo nhân viên thành công'
        : 'Cập nhật nhân viên thành công',
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
