const User = require('../../models/user.model');
const Staff = require('../../models/staff.model');
const Role = require('../../models/role.model');

const statusAccount = {
  0: 'Đang chỉnh sửa',
  1: 'Đang hoạt động',
  2: 'Ngưng hoạt động',
};

exports.getListAccount = async (status, keyword) => {
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

  const user = await User.find(filter)
    .select('code email password status statusName staffCode')
    .populate(
      'staffCode',
      'code email userName dateOfBirth loactionName status statusName roleStaff roleStaffName createdAt phone typeOfPersonnel typeOfContract cccd'
    );

  return user;
};

exports.updateAccount = async (payload) => {
  const { code, email, password, staffCode, status, roleCode } = payload;

  // ======================
  // CHECK STAFF
  // ======================
  let staff = null;
  if (staffCode !== undefined) {
    staff = await Staff.findOne({ code: staffCode });
    if (!staff) throw new Error('Nhân viên không tồn tại');
  }

  // ======================
  // CHECK ROLE
  // ======================
  let role = null;
  if (roleCode !== undefined) {
    role = await Role.findOne({ code: roleCode });
    if (!role) throw new Error('Quyền không tồn tại');
  }

  // ======================
  // CREATE
  // ======================
  if (!code || Number(code) === 0) {
    if (!email || password === undefined || !staff || !role) {
      throw new Error('Thiếu thông tin tài khoản');
    }

    const lastUser = await User.findOne().sort({ createdAt: -1 });
    let newNumber = 1;

    if (lastUser?.code) {
      newNumber = Number(lastUser.code.replace('US', '')) + 1;
    }

    const newCode = `US${String(newNumber).padStart(3, '0')}`;

    const finalStatus =
      status !== undefined && status !== null ? Number(status) : 0;

    const user = await User.create({
      code: newCode,
      email,
      password,
      roleCode: role._id,
      staffCode: staff._id,
      status: finalStatus,
      statusName: statusAccount[finalStatus],
    });

    return { isCreate: true, data: user };
  }

  // ======================
  // UPDATE
  // ======================
  const userUpdate = await User.findOne({ code });
  if (!userUpdate) throw new Error('Tài khoản không tồn tại');

  if (
    email === undefined &&
    password === undefined &&
    roleCode === undefined &&
    staffCode === undefined &&
    status === undefined
  ) {
    throw new Error('Không có dữ liệu để cập nhật');
  }

  if (email !== undefined) userUpdate.email = email;
  if (password !== undefined) userUpdate.password = password;

  if (role) userUpdate.roleCode = role._id;
  if (staff) userUpdate.staffCode = staff._id;

  if (status !== undefined) {
    const finalStatus = Number(status);
    userUpdate.status = finalStatus;
    userUpdate.statusName = statusAccount[finalStatus];
  }

  await userUpdate.save();

  return { isCreate: false, data: userUpdate };
};
