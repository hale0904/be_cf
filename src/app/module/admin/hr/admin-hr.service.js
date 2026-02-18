const Staff = require('../../../models/staff.model');

const STATUS_HR = {
  0: 'Tuyển dụng',
  1: 'Đang làm việc',
  2: 'Ngưng làm việc',
};

const ROLE_HR = {
  0: 'Nhân viên',
  1: 'Quản lý',
  2: 'Quản trị viên',
};

exports.getListHr = async (status, keyword) => {
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
    'code email userName dateOfBirth loactionName status statusName roleStaff roleStaffName createdAt phone typeOfPersonnel typeOfContract cccd'
  );

  return hr;
};

exports.getHrDetail = async (code) => {
  if (!code || typeof code !== 'string') {
    throw new Error('Mã nhân viên không hợp lệ');
  }

  const parking = await Staff.findOne({ code }).select(
    'code email userName dateOfBirth loactionName status statusName roleStaff roleStaffName createdAt phone typeOfPersonnel typeOfContract cccd'
  );

  if (!parking) {
    throw new Error('Nhân viên không tồn tại');
  }

  return parking;
};

// Create or Update parking
exports.updateHr = async (payload) => {
  const {
    code,
    email,
    userName,
    dateOfBirth,
    roleStaff,
    phone,
    loactionName,
    typeOfPersonnel,
    typeOfContract,
    cccd,
    status,
    password,
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
      !password
    ) {
      throw new Error('Thiếu thông tin nhân viên');
    }

    const count = await Staff.countDocuments();
    const newCode = `ST${String(count + 1).padStart(3, '0')}`;

    const finalStatus =
      status !== undefined && status !== null ? Number(status) : 0;

    const finalRole =
      roleStaff !== undefined && roleStaff !== null ? Number(roleStaff) : 0;

    const staff = await Staff.create({
      code: newCode,
      email,
      userName,
      dateOfBirth,
      roleStaff: finalRole,
      roleStaffName: ROLE_HR[finalRole],
      phone,
      loactionName,
      typeOfPersonnel,
      typeOfContract,
      cccd,
      status: finalStatus,
      statusName: STATUS_HR[finalStatus],
      password,
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
    roleStaff === undefined &&
    phone === undefined &&
    loactionName === undefined &&
    typeOfPersonnel === undefined &&
    typeOfContract === undefined &&
    cccd === undefined &&
    status === undefined &&
    password === undefined
  ) {
    throw new Error('Không có dữ liệu để cập nhật');
  }

  if (email !== undefined) staff.email = email;
  if (userName !== undefined) staff.userName = userName;
  if (dateOfBirth !== undefined) staff.dateOfBirth = dateOfBirth;
  if (roleStaff !== undefined) staff.roleStaff = roleStaff;
  if (phone !== undefined) staff.phone = phone;
  if (loactionName !== undefined) staff.loactionName = loactionName;
  if (typeOfPersonnel !== undefined) staff.typeOfPersonnel = typeOfPersonnel;
  if (typeOfContract !== undefined) staff.typeOfContract = typeOfContract;
  if (cccd !== undefined) staff.cccd = cccd;
  if (password !== undefined) staff.password = password;

  if (status !== undefined && status !== null) {
    const newStatus = Number(status);
    staff.status = newStatus;
    staff.statusName = STATUS_HR[newStatus];
  }

  await staff.save();

  return { isCreate: false, data: staff };
};
