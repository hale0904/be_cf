const Feature = require('../../models/feature.model');
const Menu = require('../../models/menuData.model');

exports.getListMenu = async () => {
  const features = await Feature.find({ isActive: true });

  const featureIds = features.map((f) => f._id);

  const menus = await Menu.find({
    featureCode: { $in: featureIds },
    isActive: true,
  });

  const result = features.map((f) => {
    const featureMenus = menus.filter(
      (m) => m.featureCode.toString() === f._id.toString()
    );
    return {
      code: f.code,
      name: f.name,
      isActive: f.isActive,
      menu: featureMenus.map((m) => ({
        code: m.code,
        name: m.name,
        path: m.path,
        icon: m.icon,
        order: m.order,
        parentCode: m.parentCode,
        featureCode: m.featureCode,
        isActive: m.isActive,
      })),
    };
  });

  return result;
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
    parentId === undefined &&
    isActive === undefined
  ) {
    throw new Error('Không có dữ liệu để cập nhật');
  }

  if (name !== undefined) menu.name = name;
  if (path !== undefined) menu.path = path;
  if (icon !== undefined) menu.icon = icon;
  if (order !== undefined) menu.order = order;
  if (parentId !== undefined) menu.parentId = parentId;
  if (isActive !== undefined) menu.isActive = isActive;

  await menu.save();

  return { isCreate: false, data: menu };
};
