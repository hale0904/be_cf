const Feature = require('../../models/feature.model');
const Menu = require('../../models/menuData.model');
const User = require('../../models/user.model');

exports.getListMenuByUser = async (userId) => {
  // 1. Lấy user + role + permission
  const user = await User.findById(userId).populate({
    path: 'roleCode',
    populate: {
      path: 'permissions',
      populate: {
        path: 'menuId',
      },
    },
  });

  if (!user) {
    throw new Error('User không tồn tại');
  }

  const role = user.roleCode;

  // 3. Lọc permission view
  const viewPermissions = role.permissions.filter(
    (p) => p.action === 'update' || p.action === 'view'
  );
  console.log(viewPermissions);
  // 4. Lấy danh sách menu được phép
  const allowedMenuIds = new Set();

  viewPermissions.forEach((p) => {
    if (Array.isArray(p.menuId)) {
      p.menuId.forEach((m) => {
        if (m && m._id) {
          allowedMenuIds.add(m._id.toString());
        }
      });
    }
  });

  // 5. Query menu
  const menus = await Menu.find({
    _id: { $in: Array.from(allowedMenuIds) },
    isActive: true,
  }).lean();

  // 6. Lấy feature tương ứng
  const featureIds = [...new Set(menus.map((m) => m.featureCode.toString()))];

  const features = await Feature.find({
    _id: { $in: featureIds },
    isActive: true,
  }).lean();

  // 7. Build result
  const result = features.map((f) => {
    const featureMenus = menus.filter(
      (m) => m.featureCode.toString() === f._id.toString()
    );

    return {
      code: f.code,
      name: f.name,
      isActive: f.isActive,
      menu: buildMenuTree(featureMenus),
    };
  });

  return result;
};

const buildMenuTree = (menus, parentCode = null) => {
  return menus
    .filter((m) => m.parentCode === parentCode)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((m) => ({
      code: m.code,
      name: m.name,
      path: m.path,
      icon: m.icon,
      order: m.order,
      parentCode: m.parentCode,
      featureCode: m.featureCode,
      isActive: m.isActive,
      children: buildMenuTree(menus, m.code),
    }));
};

exports.updateMenu = async (payload) => {
  const { code, name, path, icon, order, parentCode, featureCode, isActive } =
    payload;

  // ======================
  // CHECK FEATURE
  // ======================
  const feature = await Feature.findOne({ code: featureCode });
  if (!feature) {
    throw new Error('Tính năng không tồn tại');
  }

  // ======================
  // CREATE
  // ======================
  if (!code || Number(code) === 0) {
    if (!name || isActive === undefined) {
      throw new Error('Thiếu thông tin menu');
    }

    const count = await Menu.countDocuments();
    const newCode = `MN${String(count + 1).padStart(3, '0')}`;

    const menu = await Menu.create({
      code: newCode,
      name,
      path,
      icon,
      order,
      parentCode: parentCode || null, // menu cha
      featureCode: feature._id, // ObjectId
      isActive,
    });

    return { isCreate: true, data: menu };
  }

  // ======================
  // UPDATE
  // ======================
  const menu = await Menu.findOne({ code });
  if (!menu) throw new Error('Menu không tồn tại');

  if (
    name === undefined &&
    path === undefined &&
    icon === undefined &&
    order === undefined &&
    parentCode === undefined &&
    isActive === undefined
  ) {
    throw new Error('Không có dữ liệu để cập nhật');
  }

  if (name !== undefined) menu.name = name;
  if (path !== undefined) menu.path = path;
  if (icon !== undefined) menu.icon = icon;
  if (order !== undefined) menu.order = order;
  if (parentCode !== undefined) menu.parentCode = parentCode;
  if (isActive !== undefined) menu.isActive = isActive;

  await menu.save();

  return { isCreate: false, data: menu };
};
