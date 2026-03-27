// routes/staff.route.js
const express = require('express');
const router = express.Router();
const typeHrController = require('../typeHr/typeHr.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../middlewares/checkPermission.middleware');

// chỉ user có quyền create mới được vào
router.post('/getListTypeHr', authMiddleware, typeHrController.getListTypeHr);
router.post(
  '/updateTypeHr',
  authMiddleware,
  checkPermission('ADMIN_UPDATE'),
  typeHrController.updateTypeHr
);

router.post(
  '/deleteTypeHr',
  authMiddleware,
  checkPermission('ADMIN_DELETE'),
  typeHrController.deleteTypeHr
);

module.exports = router;
