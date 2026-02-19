const menuService = require('./menu.service');

exports.getListMenu = async (req, res) => {
  try {
    const data = await menuService.getListMenu();
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
