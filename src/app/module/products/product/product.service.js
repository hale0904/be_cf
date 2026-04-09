const Product = require('../../../models/product.model');
const Category = require('../../../models/category.model');

const STATUS_PRODUCT = {
  0: 'Đang chỉnh sửa',
  1: 'Đang hoạt động',
  2: 'Ngưng hoạt động',
};

// ======================
// GET LIST PRODUCT
// ======================
exports.getListProduct = async (status = [], keyword) => {
  const filter = {};

  if (
    Array.isArray(status)
      ? status.length
      : status !== undefined && status !== null && status !== ''
  ) {
    filter.status = Array.isArray(status) ? { $in: status } : status;
  }

  // search theo name + description
  if (keyword && keyword.trim() !== '') {
    const regex = new RegExp(keyword.trim(), 'i');
    filter.$or = [{ name: regex }, { code: regex }];
  }

  const products = await Product.find(filter).select(
    'code name price categoryCode image description status statusName createdAt'
  );

  return products;
};

// ======================
// GET PRODUCT DETAIL
// ======================
exports.getProductDetail = async (code) => {
  if (!code || typeof code !== 'string') {
    throw new Error('Mã sản phẩm không hợp lệ');
  }

  const product = await Product.findOne({ code })
    .populate('categoryCode', 'code name')
    .select(
      'code name price categoryCode image description status statusName createdAt'
    );

  if (!product) {
    throw new Error('Sản phẩm không tồn tại');
  }

  return product;
};

// ======================
// CREATE OR UPDATE PRODUCT
// ======================
exports.updateProduct = async (payload) => {
  const { code, name, price, categoryCode, image, description, status } =
    payload;

  // ======================
  // CREATE
  // ======================
  if (!code || Number(code) === 0) {
    if (!name || !price || !categoryCode || !image || !description) {
      throw new Error('Thiếu thông tin sản phẩm');
    }

    const category = await Category.findOne({ code: categoryCode });
    if (!category) {
      throw new Error('Danh mục không tồn tại');
    }

    const lastItem = await typeHrModel
      .findOne({ code: { $regex: /^P\d+$/ } })
      .sort({ code: -1 }) // sắp xếp giảm dần
      .select('code');

    let newNumber = 1;

    if (lastItem) {
      const currentNumber = parseInt(lastItem.code.replace('P', ''), 10);
      newNumber = currentNumber + 1;
    }

    const newCode = `THR${String(newNumber).padStart(3, '0')}`;

    const finalStatus =
      status !== undefined && status !== null ? Number(status) : 0;

    const product = await Product.create({
      code: newCode,
      name,
      price,
      categoryCode: category._id,
      image,
      description,
      status: finalStatus,
      statusName: STATUS_PRODUCT[finalStatus],
    });

    return { isCreate: true, data: product };
  }

  // ======================
  // UPDATE
  // ======================
  const productUpdate = await Product.findOne({ code });
  if (!productUpdate) throw new Error('Sản phẩm không tồn tại');

  if (
    name === undefined &&
    price === undefined &&
    categoryCode === undefined &&
    image === undefined &&
    description === undefined &&
    status === undefined
  ) {
    throw new Error('Không có dữ liệu để cập nhật');
  }

  if (name !== undefined) productUpdate.name = name;
  if (price !== undefined) productUpdate.price = price;

  if (categoryCode !== undefined) {
    const category = await Category.findOne({ code: categoryCode });
    if (!category) throw new Error('Danh mục không tồn tại');
    productUpdate.categoryCode = category._id;
  }

  if (image !== undefined) productUpdate.image = image;
  if (description !== undefined) productUpdate.description = description;

  if (status !== undefined && status !== null) {
    const newStatus = Number(status);
    productUpdate.status = newStatus;
    productUpdate.statusName = STATUS_PRODUCT[newStatus];
  }

  await productUpdate.save();

  return { isCreate: false, data: productUpdate };
};

exports.deleteProduct = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Danh sách sản phẩm không hợp lệ');
  }

  const codes = items
    .map((item) => item.code)
    .filter((code) => typeof code === 'string' && code.trim() !== '');

  if (codes.length === 0) {
    throw new Error('Không tìm thấy mã sản phẩm hợp lệ');
  }

  // lấy staff
  const products = await Product.find({
    code: { $in: codes },
  });

  if (products.length === 0) {
    throw new Error('Sản phẩm không tồn tại');
  }

  // check thiếu code
  if (products.length !== codes.length) {
    const foundCodes = products.map((s) => s.code);
    const missingCodes = codes.filter((c) => !foundCodes.includes(c));

    throw new Error(`Sản phẩm không tồn tại: ${missingCodes.join(', ')}`);
  }

  // check status
  const invalidProduct = Product.filter((s) => s.status !== 0);
  if (invalidProduct.length > 0) {
    throw new Error(
      `Chỉ xoá được sản phẩm "Đang chỉnh sửa". Mã: ${invalidProduct
        .map((s) => s.code)
        .join(', ')}`
    );
  }

  // lấy danh sách _id
  const producyIds = Product.map((s) => s._id);

  // delete bằng _id
  const result = await Product.deleteMany({
    _id: { $in: producyIds },
  });

  return {
    deletedCount: result.deletedCount,
  };
};
