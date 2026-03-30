const express = require('express');
const controller = require('./staff.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post('/getListStaff', authMiddleware, controller.getListStaff);
router.post('/getStaffDetail', authMiddleware, controller.getStaffDetail);
router.post(
  '/updateStaff',
  authMiddleware,
  checkPermission('HR_UPDATE'),
  controller.updateStaff
);
router.post(
  '/deleteStaff',
  authMiddleware,
  checkPermission('HR_DELETE', 'ADMIN_DELETE'),
  controller.deleteStaff
);

module.exports = router;
