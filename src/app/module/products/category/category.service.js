const categoryModel = require('../../../models/category.model');
const productModel = require('../../../models/product.model');

const STATUS_CATEGORY = {
  0: 'Đang chỉnh sửa',
  1: 'Đang hoạt động',
  2: 'Ngưng hoạt động',
};

exports.getListCategory = async (status = [], keyword) => {
  const filter = {};

  // filter theo status
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

    filter.$or = [{ name: regex }, { code: regex }];
  }

  const category = await categoryModel
    .find(filter)
    .select('code name description status statusName createdAt');

  return category;
};

exports.getCategoryDetail = async (code) => {
  if (!code || typeof code !== 'string') {
    throw new Error('Mã loại không hợp lệ');
  }

  const category = await categoryModel
    .findOne({ code })
    .select('code name description status statusName createdAt');

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

    const count = await categoryModel.countDocuments();
    const newCode = `C${String(count + 1).padStart(3, '0')}`;

    const finalStatus =
      status !== undefined && status !== null ? Number(status) : 0;

    const category = await categoryModel.create({
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
  const categoryUpdate = await categoryModel.findOne({ code });
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

exports.deleteCategory = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Danh sách danh mục không hợp lệ');
  }

  const codes = items
    .map((item) => item.code)
    .filter((code) => typeof code === 'string' && code.trim() !== '');

  if (codes.length === 0) {
    throw new Error('Không tìm thấy mã danh mục hợp lệ');
  }

  // lấy category
  const categorys = await categoryModel.find({
    code: { $in: codes },
  });

  if (categorys.length === 0) {
    throw new Error('Danh mục không tồn tại');
  }

  // check thiếu code
  if (categorys.length !== codes.length) {
    const foundCodes = categorys.map((c) => c.code);
    const missingCodes = codes.filter((c) => !foundCodes.includes(c));

    throw new Error(`Danh mục không tồn tại: ${missingCodes.join(', ')}`);
  }

  // check status
  const invalidCate = categorys.filter((c) => c.status !== 0);
  if (invalidCate.length > 0) {
    throw new Error(
      `Chỉ xoá được danh mục "Đang chỉnh sửa". Mã: ${invalidCate
        .map((c) => c.code)
        .join(', ')}`
    );
  }

  const categoryIds = categorys.map((c) => c._id);

  // dùng distinct (tối ưu hơn find)
  const usedCategoryIds = await productModel.distinct('categoryCode', {
    categoryCode: { $in: categoryIds },
  });

  if (usedCategoryIds.length > 0) {
    const mapIdToCode = new Map(
      categorys.map((c) => [c._id.toString(), c.code])
    );

    const usedCategoryCodes = usedCategoryIds.map((id) =>
      mapIdToCode.get(id.toString())
    );

    throw new Error(
      `Không thể xoá danh mục đang chứa sản phẩm. Mã: ${usedCategoryCodes.join(', ')}`
    );
  }

  // delete bằng _id (chuẩn nhất)
  const result = await categoryModel.deleteMany({
    _id: { $in: categoryIds },
  });

  return {
    deletedCount: result.deletedCount,
  };
};
