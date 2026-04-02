const roleService = require('./route.service');

// Get list roles with filter and search
exports.getListRoles = async (req, res) => {
  try {
    const { status, keyword } = req.body;

    const data = await roleService.getListRoles(status, keyword);
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
