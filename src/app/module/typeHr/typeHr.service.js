const staffModel = require('../../models/staff.model');
const typeHrModel = require('../../models/typeHr.model');

const STATUS_TYPEHR = {
  0: 'Đang chỉnh sửa',
  1: 'Đang hoạt động',
  2: 'Ngưng hoạt động',
};

exports.getListTypeHr = async (typeData, status = [], keyword) => {
  const filter = {};

  if (typeData === undefined || typeData === null) {
    throw new Error('typeData là bắt buộc');
  }

  // filter theo typeData
  filter.typeData = typeData;
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

  const typeHr = await typeHrModel
    .find(filter)
    .select('code name status statusName createdAt typeData');

  return typeHr;
};

exports.updateTypeHr = async (payload) => {
  const { code, name, status, typeData } = payload;

  // ======================
  // CREATE
  // ======================
  if (!code || Number(code) === 0) {
    if (!name) {
      throw new Error('Thiếu thông tin');
    }

    const lastItem = await typeHrModel
      .findOne({ code: { $regex: /^THR\d+$/ } })
      .sort({ code: -1 }) // sắp xếp giảm dần
      .select('code');

    let newNumber = 1;

    if (lastItem) {
      const currentNumber = parseInt(lastItem.code.replace('THR', ''), 10);
      newNumber = currentNumber + 1;
    }

    const newCode = `THR${String(newNumber).padStart(3, '0')}`;

    const existingTypeHr = await typeHrModel.findOne({ code });
    if (existingTypeHr) throw new Error('Mã đã tồn tại');

    const finalStatus =
      status !== undefined && status !== null ? Number(status) : 0;

    const typeHr = await typeHrModel.create({
      code: newCode,
      name,
      status: finalStatus,
      statusName: STATUS_TYPEHR[finalStatus],
      typeData,
    });

    return { isCreate: true, data: typeHr };
  }

  // ======================
  // UPDATE
  // ======================
  const typeHrUpdate = await typeHrModel.findOne({ code });
  if (!typeHrUpdate) throw new Error('Mã không tồn tại');

  if (name === undefined && status === undefined) {
    throw new Error('Không có dữ liệu để cập nhật');
  }

  if (name !== undefined) typeHrModel.name = name;

  if (status !== undefined && status !== null) {
    const newStatus = Number(status);
    typeHrModel.status = newStatus;
    typeHrModel.statusName = STATUS_TYPEHR[newStatus];
  }

  await typeHrUpdate.save();

  return { isCreate: false, data: typeHrUpdate };
};

exports.deleteTypeHr = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Danh sách không hợp lệ');
  }

  const codes = items
    .map((item) => item.code)
    .filter((code) => typeof code === 'string' && code.trim() !== '');

  if (codes.length === 0) {
    throw new Error('Không tìm thấy mã hợp lệ');
  }

  // lấy typeHrs
  const typeHrs = await typeHrModel.find({
    code: { $in: codes },
  });

  if (typeHrs.length === 0) {
    throw new Error('Thông tin không tồn tại');
  }

  // check thiếu code
  if (typeHrs.length !== codes.length) {
    const foundCodes = typeHrs.map((c) => c.code);
    const missingCodes = codes.filter((c) => !foundCodes.includes(c));

    throw new Error(`Loại không tồn tại: ${missingCodes.join(', ')}`);
  }

  // check status
  const invalidCate = typeHrs.filter((c) => c.status !== 0);
  if (invalidCate.length > 0) {
    throw new Error(
      `Chỉ xoá được danh mục "Đang chỉnh sửa". Mã: ${invalidCate
        .map((c) => c.code)
        .join(', ')}`
    );
  }

  const typeHrIds = typeHrs.map((c) => c._id);

  // dùng distinct (tối ưu hơn find)
  const usedTypeHrIds = await staffModel.distinct(
    'typeOfPosition typeOfPersonnelCode typeOfContract',
    {
      typeOfPosition: { $in: typeHrIds },
      typeOfPersonnelCode: { $in: typeHrIds },
      typeOfContract: { $in: typeHrIds },
    }
  );

  if (usedTypeHrIds.length > 0) {
    const mapIdToCode = new Map(typeHrs.map((c) => [c._id.toString(), c.code]));

    const usedtypeHrsCodes = usedTypeHrIds.map((id) =>
      mapIdToCode.get(id.toString())
    );

    throw new Error(
      `Không thể xoá loại Type đang chứa nhân viên. Mã: ${usedtypeHrsCodes.join(', ')}`
    );
  }

  // delete bằng _id (chuẩn nhất)
  const result = await typeHrModel.deleteMany({
    _id: { $in: typeHrIds },
  });

  return {
    deletedCount: result.deletedCount,
  };
};
