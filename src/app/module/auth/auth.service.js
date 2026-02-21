const User = require('../../models/user.model');
const Staff = require('../../models/staff.model');
const Role = require('../../models/role.model');

const { hashPassword, comparePassword } = require('../../utils/hash.util');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../utils/token.util');

// REGISTER USER cho STAFF có sẵn
exports.register = async ({ staffCode, email, password, roleCode }) => {
  // 1. Tìm staff theo code
  const staff = await Staff.findOne({ code: staffCode });
  if (!staff) throw new Error('Staff not found');

  // 2. Check staff đã có user chưa
  if (staff.userCode) throw new Error('Staff already has an account');

  // 3. Check email ở User
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already exists');

  // 4. Lấy role (role đã được tạo sẵn)
  const role = await Role.findOne({ code: roleCode || 'STAFF' });
  if (!role) throw new Error('Role not found');

  // 5. Hash password
  const hashedPassword = await hashPassword(password);

  // 6. Tạo User
  const user = await User.create({
    email,
    password: hashedPassword,
    roleCode: role._id, // ObjectId
    status: 1,
    staffCode: staff._id, // ObjectId
  });

  // 7. Gán userId cho staff
  staff.userCode = user._id;
  await staff.save();

  return user;
};

// LOGIN
exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).populate('roleCode');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const payload = {
    userId: user._id,
    roleId: user.roleCode,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};
