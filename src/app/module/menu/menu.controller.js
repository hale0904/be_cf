const menuService = require('./menu.service');

exports.getMyMenu = async (req, res) => {
  try {
    const userId = req.user._id; // lấy từ middleware auth

    const data = await menuService.getListMenuByUser(userId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create or Update menu
exports.updateMenu = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      adminCode: req.admin?.code, // lấy từ token (nếu có auth)
    };

    const result = await menuService.updateMenu(payload);

    return res.status(200).json({
      success: true,
      message: result.isCreate
        ? 'Tạo menu thành công'
        : 'Cập nhật menu thành công',
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
