const Staff = require('../../models/staff.model');
const typeHrModel = require('../../models/typeHr.model');

const STATUS_HR = {
  0: 'Tuyển dụng',
  1: 'Đang làm việc',
  2: 'Ngưng làm việc',
};

exports.getListStaff = async (status, keyword) => {
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

  const hr = await Staff.find(filter).select(
    'code email userName dateOfBirth loactionName status statusName createdAt phone typeOfPosition typeOfPersonnel typeOfContract cccd'
  );

  return hr;
};

exports.getStaffDetail = async (code) => {
  if (!code || typeof code !== 'string') {
    throw new Error('Mã nhân viên không hợp lệ');
  }

  const parking = await Staff.findOne({ code }).select(
    'code email userName dateOfBirth loactionName status statusName createdAt phone typeOfPosition typeOfPersonnel typeOfContract cccd'
  );

  if (!parking) {
    throw new Error('Nhân viên không tồn tại');
  }

  return parking;
};

// Create or Update parking
exports.updateStaff = async (payload) => {
  const {
    code,
    email,
    userName,
    dateOfBirth,
    phone,
    loactionName,
    typeOfPosition,
    typeOfPersonnel,
    typeOfContract,
    cccd,
    status,
  } = payload;

  // ======================
  // CREATE
  // ======================
  if (!code || Number(code) === 0) {
    if (
      !email ||
      !userName ||
      !dateOfBirth ||
      !loactionName ||
      !typeOfPersonnel ||
      !typeOfContract ||
      !cccd ||
      !phone ||
      !typeOfPosition
    ) {
      throw new Error('Thiếu thông tin nhân viên');
    }

    const lastItem = await Staff.findOne({ code: { $regex: /^ST\d+$/ } })
      .sort({ code: -1 }) // sắp xếp giảm dần
      .select('code');

    let newNumber = 1;

    if (lastItem) {
      const currentNumber = parseInt(lastItem.code.replace('ST', ''), 10);
      newNumber = currentNumber + 1;
    }

    const newCode = `ST${String(newNumber).padStart(3, '0')}`;

    const existingTypeHr = await Staff.findOne({ code });
    if (existingTypeHr) throw new Error('Mã đã tồn tại');

    const position = await typeHrModel.findOne({ code: typeOfPosition });
    const personnel = await typeHrModel.findOne({ code: typeOfPersonnel });
    const contract = await typeHrModel.findOne({ code: typeOfContract });
    if (!position || !personnel || !contract) {
      throw new Error('Chức danh không tồn tại');
    }

    const finalStatus =
      status !== undefined && status !== null ? Number(status) : 0;

    const staff = await Staff.create({
      code: newCode,
      email,
      userName,
      dateOfBirth,
      phone,
      loactionName,
      typeOfPosition: position._id,
      typeOfPersonnel: personnel._id,
      typeOfContract: contract._id,
      cccd,
      status: finalStatus,
      statusName: STATUS_HR[finalStatus],
    });

    return { isCreate: true, data: staff };
  }

  // ======================
  // UPDATE
  // ======================
  const staff = await Staff.findOne({ code });
  if (!staff) throw new Error('Nhân viên không tồn tại');

  if (
    email === undefined &&
    userName === undefined &&
    dateOfBirth === undefined &&
    typeOfPosition === undefined &&
    phone === undefined &&
    loactionName === undefined &&
    typeOfPersonnel === undefined &&
    typeOfContract === undefined &&
    cccd === undefined &&
    status === undefined
  ) {
    throw new Error('Không có dữ liệu để cập nhật');
  }

  if (email !== undefined) staff.email = email;
  if (userName !== undefined) staff.userName = userName;
  if (dateOfBirth !== undefined) staff.dateOfBirth = dateOfBirth;
  if (phone !== undefined) staff.phone = phone;
  if (loactionName !== undefined) staff.loactionName = loactionName;
  if (cccd !== undefined) staff.cccd = cccd;

  if (typeOfPosition !== undefined) {
    const position = await typeHrModel.findOne({ code: typeOfPosition });
    if (!position) throw new Error('Chức danh không tồn tại');
    staff.typeOfPosition = position._id;
  }

  if (typeOfPersonnel !== undefined) {
    const personnel = await typeHrModel.findOne({ code: typeOfPersonnel });
    if (!personnel) throw new Error('Loại nhân viên không tồn tại');
    staff.typeOfPersonnel = personnel._id;
  }

  if (typeOfContract !== undefined) {
    const contract = await typeHrModel.findOne({ code: typeOfContract });
    if (!contract) throw new Error('Loại hợp đồng không tồn tại');
    staff.typeOfContract = contract._id;
  }

  if (status !== undefined && status !== null) {
    const newStatus = Number(status);
    staff.status = newStatus;
    staff.statusName = STATUS_HR[newStatus];
  }

  await staff.save();

  return { isCreate: false, data: staff };
};

exports.deleteStaff = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Danh sách nhân viên không hợp lệ');
  }

  const codes = items
    .map((item) => item.code)
    .filter((code) => typeof code === 'string' && code.trim() !== '');

  if (codes.length === 0) {
    throw new Error('Không tìm thấy mã nhân viên hợp lệ');
  }

  // lấy staff
  const staffs = await Staff.find({
    code: { $in: codes },
  });

  if (staffs.length === 0) {
    throw new Error('Nhân viên không tồn tại');
  }

  // check thiếu code
  if (staffs.length !== codes.length) {
    const foundCodes = staffs.map((s) => s.code);
    const missingCodes = codes.filter((c) => !foundCodes.includes(c));

    throw new Error(`Nhân viên không tồn tại: ${missingCodes.join(', ')}`);
  }

  // check status
  const invalidStaff = staffs.filter((s) => s.status !== 0);
  if (invalidStaff.length > 0) {
    throw new Error(
      `Chỉ xoá được danh mục "Đang chỉnh sửa". Mã: ${invalidStaff
        .map((s) => s.code)
        .join(', ')}`
    );
  }

  // lấy danh sách _id
  const staffIds = staffs.map((s) => s._id);

  // delete bằng _id
  const result = await Staff.deleteMany({
    _id: { $in: staffIds },
  });

  return {
    deletedCount: result.deletedCount,
  };
};
