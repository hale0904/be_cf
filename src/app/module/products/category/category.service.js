const Category = require('../../../models/category.model');

const STATUS_CATEGORY = {
  0: 'Đang chỉnh sửa',
  1: 'Đang hoạt động',
  2: 'Ngưng hoạt động',
};

exports.getListCategory = async (status, keyword) => {
  const filter = {};

  // filter theo status (dropdown)
  if (status !== undefined && status !== null && status !== '') {
    filter.status = Number(status);
  }

  // search theo name + location
  if (keyword && keyword.trim() !== '') {
    const regex = new RegExp(keyword.trim(), 'i'); // không phân biệt hoa thường

    filter.$or = [{ name: regex }, { location: regex }];
  }

  const category = await Category.find(filter).select(
    'code name description status statusName createdAt'
  );

  return category;
};

exports.getCategoryDetail = async (code) => {
  if (!code || typeof code !== 'string') {
    throw new Error('Mã loại không hợp lệ');
  }

  const category = await Category.findOne({ code }).select(
    'code name description status statusName createdAt'
  );

  if (!category) {
    throw new Error('Loại không tồn tại');
  }

  return category;
};

// Create or Update parking
exports.updateCategory = async (payload) => {
  const { code, name, description, status } = payload;

  // ======================
  // CREATE
  // ======================
  if (!code || Number(code) === 0) {
    if (!name || !description) {
      throw new Error('Thiếu thông tin loại');
    }

    const count = await Category.countDocuments();
    const newCode = `C${String(count + 1).padStart(3, '0')}`;

    const finalStatus =
      status !== undefined && status !== null ? Number(status) : 0;

    const category = await Category.create({
      code: newCode,
      name,
      description,
      status: finalStatus,
      statusName: STATUS_CATEGORY[finalStatus],
    });

    return { isCreate: true, data: category };
  }

  // ======================
  // UPDATE
  // ======================
  const categoryUpdate = await Category.findOne({ code });
  if (!categoryUpdate) throw new Error('Loại không tồn tại');

  if (name === undefined && description === undefined && status === undefined) {
    throw new Error('Không có dữ liệu để cập nhật');
  }

  if (name !== undefined) categoryUpdate.name = name;
  if (description !== undefined) categoryUpdate.description = description;

  if (status !== undefined && status !== null) {
    const newStatus = Number(status);
    categoryUpdate.status = newStatus;
    categoryUpdate.statusName = STATUS_CATEGORY[newStatus];
  }

  await categoryUpdate.save();

  return { isCreate: false, data: categoryUpdate };
};
