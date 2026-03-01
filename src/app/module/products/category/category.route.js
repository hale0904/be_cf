const express = require('express');
const controller = require('./category.controller');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post('/getListCategory', authMiddleware, controller.getListCategory);
router.post('/getHrDetail', authMiddleware, controller.getHrDetail);
router.post(
  '/updateCategory',
  authMiddleware,
  checkPermission('HR_UPDATE', 'ADMIN_UPDATE'),
  controller.updateCategory
);

module.exports = router;
