const accountStaffService = require('./accountStaff.service');

// Get list account staff with filter and search
exports.getListAccountStaff = async (req, res) => {
  try {
    const { status, keyword } = req.body;

    const data = await accountStaffService.getListAccountStaff(status, keyword);
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

exports.getByCodeStaff = async (req, res) => {
  try {
    const { codeStaff } = req.body;

    const data = await accountStaffService.getByCodeStaff(codeStaff);
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

exports.updateAccountStaff = async (req, res) => {
  try {
    const payload = {
      ...req.body,
    };

    const result = await accountStaffService.updateAccountStaff(payload);

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

exports.deleteAccountStaff = async (req, res) => {
  try {
    const { items } = req.body; // DTO[]

    const result = await accountStaffService.deleteAccountStaff(items);

    return res.status(200).json({
      success: true,
      message: `Xóa thành công ${result.deletedCount} tài khoản`,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
