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
exports.getListProduct = async (status, keyword) => {
  const filter = {};

  // filter theo status
  if (status !== undefined && status !== null && status !== '') {
    filter.status = Number(status);
  }

  // search theo name + description
  if (keyword && keyword.trim() !== '') {
    const regex = new RegExp(keyword.trim(), 'i');
    filter.$or = [{ name: regex }, { description: regex }];
  }

  const products = await Product.find(filter)
    .populate('categoryCode', 'code name') // lấy thông tin category
    .select(
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

    const count = await Product.countDocuments();
    const newCode = `P${String(count + 1).padStart(3, '0')}`;

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
