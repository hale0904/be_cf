const accountService = require('./accountUser.service');

exports.getListAccount = async (req, res) => {
  try {
    const data = await accountService.getListAccount();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Create or Update menu
exports.updateAccount = async (req, res) => {
  try {
    const {
      code,
      staffCode,
      email,
      password,
      roleCode,
      confirmPassword,
      status,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    await accountService.updateAccount({
      code,
      staffCode,
      email,
      password,
      roleCode,
      status,
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
