const express = require('express');
const controller = require('./accountStaff.controller');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post(
  '/getListAccountStaff',
  authMiddleware,
  controller.getListAccountStaff
);
router.post('/getByCodeStaff', authMiddleware, controller.getByCodeStaff);
router.post(
  '/updateAccountStaff',
  authMiddleware,
  checkPermission('ADMIN_UPDATE'),
  controller.updateAccountStaff
);
router.post(
  '/deleteAccountStaff',
  authMiddleware,
  checkPermission('ADMIN_DELETE'),
  controller.deleteAccountStaff
);

module.exports = router;
