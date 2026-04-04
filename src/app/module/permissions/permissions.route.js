const express = require('express');
const controller = require('./permissions.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post(
  '/getListPermissions',
  authMiddleware,
  controller.getListPermissions
);

// routes

router.patch(
  '/updatePermissionMenus',
  authMiddleware,
  checkPermission('ADMIN_UPDATE'),
  controller.updatePermissionMenus
);
// router.post('/getByCodeStaff', authMiddleware, controller.getByCodeStaff);
// router.post(
//   '/updateAccountStaff',
//   authMiddleware,
//   checkPermission('ADMIN_UPDATE'),
//   controller.updateAccountStaff
// );
// router.post(
//   '/deleteAccountStaff',
//   authMiddleware,
//   checkPermission('ADMIN_DELETE'),
//   controller.deleteAccountStaff
// );

module.exports = router;
