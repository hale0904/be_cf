const express = require('express');
const controller = require('./accountUser.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post('/getListAccount', authMiddleware, controller.getListAccount);
router.post(
  '/updateAccount',
  authMiddleware,
  checkPermission('ADMIN_UPDATE'),
  controller.updateAccount
);

module.exports = router;
