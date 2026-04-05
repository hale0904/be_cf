const permissionModel = require('../../models/permission.model');
const roleModel = require('../../models/role.model');
const menuModel = require('../../models/menuData.model');

exports.getListPermissions = async (code, keyword) => {
  if (!code) throw new Error('Mã role là bắt buộc');

  // Lấy role theo code
  const role = await roleModel
    .findOne({ code: code })
    .populate({
      path: 'permissions',
      select: 'code name action featureId menuId',
      populate: [
        { path: 'featureId', select: 'code name' },
        { path: 'menuId', select: 'code name' },
      ],
    })
    .lean();

  if (!role) throw new Error('Role không tồn tại');

  let permissions = role.permissions;

  if (keyword && keyword.trim() !== '') {
    const regex = new RegExp(keyword.trim(), 'i');
    permissions = permissions.filter(
      (p) => regex.test(p.code) || regex.test(p.name)
    );
  }

  return permissions;
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
