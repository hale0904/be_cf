const permissionService = require('./permissions.service');

// Get list permissions with filter and search
exports.getListPermissions = async (req, res) => {
  try {
    const { code, keyword } = req.body;

    const data = await permissionService.getListPermissions(code, keyword);
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

exports.updatePermissionMenus = async (req, res) => {
  try {
    const { permissionId } = req.body;
    const { menuIds } = req.body;

    const permission = await permissionService.updatePermissionMenus(
      permissionId,
      menuIds
    );

    return res.status(200).json({
      success: true,
      message: 'Cập nhật chức năng cho phân quyền thành công',
      data: permission,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
