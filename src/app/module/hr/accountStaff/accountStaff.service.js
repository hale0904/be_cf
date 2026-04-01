const userModel = require('../../../models/user.model');
const staffModel = require('../../../models/staff.model');
const roleModel = require('../../../models/role.model');

const { hashPassword } = require('../../../utils/hash.util');

const STATUS_ACCOUNTSTAFF = {
  0: 'Tuyển dụng',
  1: 'Đang làm việc',
  2: 'Ngưng làm việc',
};

exports.getListAccountStaff = async (status = [], keyword) => {
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

    filter.$or = [{ email: regex }, { code: regex }];
  }

  const accountStaffs = await userModel
    .find(filter)
    .select('code email staffCode roleCode')
    .populate(
      'staffCode',
      'code email userName dateOfBirth loactionName status statusName createdAt phone typeOfPosition typeOfPersonnel typeOfContract cccd'
    )
    .populate('roleCode', 'code name');

  return accountStaffs;
};

exports.getByCodeStaff = async (codeStaff) => {
  if (!codeStaff || typeof codeStaff !== 'string') {
    throw new Error('Mã nhân viên không hợp lệ');
  }

  const existStaff = await staffModel.findOne({ code: codeStaff });
  if (!existStaff) {
    throw new Error('Nhân viên không tồn tại');
  }

  const existAccount = await userModel.findOne({ staffCode: existStaff._id });
  if (existAccount) {
    throw new Error('Nhân viên đã có tài khoản');
  }

  const accountStaffs = await staffModel
    .findOne({ code: codeStaff })
    .select(
      'code email userName dateOfBirth loactionName status statusName createdAt phone typeOfPosition typeOfPersonnel typeOfContract cccd'
    )
    .populate('typeOfPosition', 'code name')
    .populate('typeOfPersonnel', 'code name')
    .populate('typeOfContract', 'code name');

  return accountStaffs;
};

exports.updateAccountStaff = async (payload) => {
  const { code, password, roleCode, staffCode, status } = payload;

  // ======================
  // CREATE
  // ======================
  if (!code || Number(code) === 0) {
    if (!password || !roleCode || !staffCode) {
      throw new Error('Thiếu thông tin tài khoản');
    }

    const staff = await staffModel.findOne({ code: staffCode });
    if (!staff) {
      throw new Error('Nhân viên không tồn tại');
    }

    const role = await roleModel.findOne({ code: roleCode });
    if (!role) {
      throw new Error('Vai trò không tồn tại');
    }

    const count = await userModel.countDocuments();
    const newCode = `ACC${String(count + 1).padStart(3, '0')}`;

    const finalStatus =
      status !== undefined && status !== null ? Number(status) : 0;

    const hashedPassword = await hashPassword(password);

    const account = await userModel.create({
      code: newCode,
      email: staff.email,
      password: hashedPassword,
      roleCode: role._id,
      staffCode: staff._id,
      status: finalStatus,
      statusName: STATUS_ACCOUNTSTAFF[finalStatus],
    });

    return { isCreate: true, data: account };
  }

  // ======================
  // UPDATE
  // ======================
  const accountUpdate = await userModel.findOne({ code });
  if (!accountUpdate) throw new Error('Tài khoản không tồn tại');

  if (
    password === undefined &&
    roleCode === undefined &&
    staffCode === undefined &&
    status === undefined
  ) {
    throw new Error('Không có dữ liệu để cập nhật');
  }

  if (password !== undefined) {
    const hashedPassword = await hashPassword(password);
    accountUpdate.password = hashedPassword;
  }
  if (roleCode !== undefined) {
    const role = await roleModel.findOne({ code: roleCode });
    if (!role) throw new Error('Vai trò không tồn tại');
    accountUpdate.roleCode = role._id;
  }
  if (staffCode !== undefined) {
    const staff = await staffModel.findOne({ code: staffCode });
    if (!staff) throw new Error('Nhân viên không tồn tại');
    accountUpdate.staffCode = staff._id;
  }
  if (status !== undefined && status !== null) {
    const newStatus = Number(status);
    accountUpdate.status = newStatus;
    accountUpdate.statusName = STATUS_ACCOUNTSTAFF[newStatus];
  }

  await accountUpdate.save();

  return { isCreate: false, data: accountUpdate };
};

exports.deleteAccountStaff = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Danh sách tài khoản không hợp lệ');
  }

  const codes = items
    .map((item) => item.code)
    .filter((code) => typeof code === 'string' && code.trim() !== '');

  if (codes.length === 0) {
    throw new Error('Không tìm thấy mã tài khoản hợp lệ');
  }

  // lấy account
  const accounts = await userModel.find({
    code: { $in: codes },
  });

  if (accounts.length === 0) {
    throw new Error('Tài khoản không tồn tại');
  }

  // check thiếu code
  if (accounts.length !== codes.length) {
    const foundCodes = accounts.map((a) => a.code);
    const missingCodes = codes.filter((c) => !foundCodes.includes(c));

    throw new Error(`Tài khoản không tồn tại: ${missingCodes.join(', ')}`);
  }

  // check status
  const invalidAccounts = accounts.filter((a) => a.status !== 0);
  if (invalidAccounts.length > 0) {
    throw new Error(
      `Chỉ xoá được tài khoản "Đang chỉnh sửa". Mã: ${invalidAccounts
        .map((a) => a.code)
        .join(', ')}`
    );
  }

  // lấy danh sách _id
  const accountIds = accounts.map((a) => a._id);

  // delete bằng _id
  const result = await userModel.deleteMany({
    _id: { $in: accountIds },
  });

  return {
    deletedCount: result.deletedCount,
  };
};
