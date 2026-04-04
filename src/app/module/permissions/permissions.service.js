const permissionModel = require('../../models/permission.model');
const roleModel = require('../../models/role.model');
const menuModel = require('../../models/menuData.model');

exports.getListPermissions = async (roleId, status = [], keyword) => {
  const filter = {};

  if (
    Array.isArray(status)
      ? status.length
      : status !== undefined && status !== null && status !== ''
  ) {
    filter.status = Array.isArray(status) ? { $in: status } : status;
  }

  if (keyword && keyword.trim() !== '') {
    const regex = new RegExp(keyword.trim(), 'i');

    filter.$or = [{ email: regex }, { code: regex }, { name: regex }];
  }

  const permissions = await permissionModel
    .find(filter)
    .select('code name action featureId menuId')
    .populate('featureId', 'code name')
    .populate('menuId', 'code name')
    .lean();

  const role = await roleModel.findById(roleId).select('permissions').lean();

  const selectedPermissionIds =
    role?.permissions?.map((id) => id.toString()) || [];

  const result = permissions.map((permission) => ({
    ...permission,
    checked: selectedPermissionIds.includes(permission._id.toString()),
  }));

  return result;
};

exports.updatePermissionMenus = async (permissionId, menuIds) => {
  const permission = await permissionModel.findById(permissionId);

  if (!permission) {
    throw new Error('Permission not found');
  }

  const menus = await menuModel
    .find({
      _id: { $in: menuIds },
    })
    .select('featureCode');

  const featureIds = [
    ...new Set(menus.map((item) => item.featureCode.toString())),
  ];

  permission.menuId = menuIds;
  permission.featureId = featureIds;

  await permission.save();

  return permission;
};
