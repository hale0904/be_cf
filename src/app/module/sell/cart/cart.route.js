const express = require('express');
const router = express.Router();
const cartController = require('../cart/cart.controller');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../../middlewares/checkPermission.middleware');

// chỉ user có quyền create mới được vào
router.post('/getListCart', authMiddleware, cartController.getListCart);
router.post(
  '/updateCart',
  authMiddleware,
  checkPermission('ADMIN_UPDATE', 'HR_UPDATE', 'STAFF_UPDATE'),
  cartController.updateCart
);

router.post(
  '/deleteProductInCart',
  authMiddleware,
  checkPermission('ADMIN_UPDATE', 'HR_UPDATE', 'STAFF_UPDATE'),
  cartController.deleteProductInCart
);

module.exports = router;
