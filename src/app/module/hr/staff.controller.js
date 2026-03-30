const hrService = require('./staff.service');

// Get list staff with filter and search
exports.getListStaff = async (req, res) => {
  try {
    const { status, keyword } = req.body;

    const data = await hrService.getListStaff(status, keyword);
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

// Get staff detail by code
exports.getStaffDetail = async (req, res) => {
  try {
    const { code } = req.body;
    const data = await hrService.getStaffDetail(code);

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

// Create or Update staff
exports.updateStaff = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      adminCode: req.admin?.code, // lấy từ token (nếu có auth)
    };

    const result = await hrService.updateStaff(payload);

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

exports.deleteStaff = async (req, res) => {
  try {
    const { items } = req.body; // DTO[]

    const result = await hrService.deleteStaff(items);

    return res.status(200).json({
      success: true,
      message: `Xóa thành công ${result.deletedCount} nhân viên`,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
