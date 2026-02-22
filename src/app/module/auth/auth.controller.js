const authService = require('./auth.service');

// Register
exports.register = async (req, res) => {
  try {
    const { staffCode, email, password, roleCode, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    await authService.register({
      staffCode,
      email,
      password,
      roleCode,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.login({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        email: user.email,
        role: {
          code: user.roleCode.code,
          name: user.roleCode.name,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};
