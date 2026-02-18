const Feature = require('../../models/feature.model');

exports.getListFeature = async () => {
  const hr = await Feature.find().select('code name isActive');
  return hr;
};

// Create or Update parking
exports.updateFeature = async (payload) => {
  const { code, name, isActive } = payload;

  // ======================
  // CREATE
  // ======================
  if (!code || Number(code) === 0) {
    if (!name || isActive === undefined) {
      throw new Error('Thiếu thông tin tính năng');
    }

    const count = await Feature.countDocuments();
    const newCode = `FT${String(count + 1).padStart(3, '0')}`;

    const feature = await Feature.create({
      code: newCode,
      name,
      isActive,
    });

    return { isCreate: true, data: feature };
  }

  // ======================
  // UPDATE
  // ======================
  const feature = await Feature.findOne({ code });
  if (!feature) throw new Error('Tính năng không tồn tại');

  if (name === undefined && isActive === undefined) {
    throw new Error('Không có dữ liệu để cập nhật');
  }

  if (name !== undefined) feature.name = name;
  if (isActive !== undefined) feature.isActive = isActive;

  await feature.save();

  return { isCreate: false, data: feature };
};
