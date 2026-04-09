const express = require('express');
const controller = require('./category.controller');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post('/getListCategory', authMiddleware, controller.getListCategory);
router.post(
  '/getListCateProduct',
  authMiddleware,
  controller.getListCateProduct
);
router.post('/getHrDetail', authMiddleware, controller.getHrDetail);
router.post(
  '/updateCategory',
  authMiddleware,
  checkPermission('HR_UPDATE', 'ADMIN_UPDATE'),
  controller.updateCategory
);

router.post(
  '/deleteCategory',
  authMiddleware,
  checkPermission('HR_DELETE', 'ADMIN_DELETE'),
  controller.deleteCategory
);

module.exports = router;
