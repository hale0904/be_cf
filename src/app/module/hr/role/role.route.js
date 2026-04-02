const express = require('express');
const controller = require('./role.controller');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post('/getListRoles', authMiddleware, controller.getListRoles);

module.exports = router;
