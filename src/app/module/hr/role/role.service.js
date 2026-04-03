const roleModel = require('../../../models/role.model');

const STATUS_ROLE = {
  0: 'Đang chỉnh sửa',
  1: 'Hoạt động',
  2: 'Ngưng hoạt động',
};

exports.getListRoles = async (status = [], keyword) => {
  const filter = {};

  if (
    Array.isArray(status)
      ? status.length
      : status !== undefined && status !== null && status !== ''
  ) {
    filter.status = Array.isArray(status) ? { $in: status } : status;
  }

  // search theo name + location
  if (keyword && keyword.trim() !== '') {
    const regex = new RegExp(keyword.trim(), 'i'); // không phân biệt hoa thường

    filter.$or = [{ userName: regex }, { code: regex }];
  }

  const roles = await roleModel.find(filter).select('code name ');

  return roles;
};
