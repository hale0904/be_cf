const express = require('express');
const controller = require('./product.controller');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post('/getListProduct', authMiddleware, controller.getListProduct);
router.post('/getProductDetail', authMiddleware, controller.getProductDetail);
router.post(
  '/updateProduct',
  authMiddleware,
  checkPermission('HR_UPDATE', 'ADMIN_UPDATE'),
  controller.updateProduct
);

router.post(
  '/deleteProduct',
  authMiddleware,
  checkPermission('ADMIN_UPDATE', 'HR_UPDATE'),
  controller.deleteProduct
);

module.exports = router;
