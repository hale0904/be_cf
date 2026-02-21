const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer xxx
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // decoded = { userId, roleId, iat, exp }

    // Lấy user + role + permissions
    const user = await User.findById(decoded.userId).populate({
      path: 'roleCode',
      populate: {
        path: 'permissions',
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // gắn vào request
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: 'Unauthorized', error: err.message });
  }
};
