const express = require('express');
const controller = require('./menu.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post('/getMyMenu', authMiddleware, controller.getMyMenu);
router.post('/getListAllMenu', authMiddleware, controller.getListAllMenu);
// router.post('/getList', authMiddleware, controller.getMyMenu);

// router.post(
//   '/updateMenu',
//   authMiddleware,
//   // checkPermission('ADMIN_UPDATE'),
//   controller.updateMenu
// );

module.exports = router;
