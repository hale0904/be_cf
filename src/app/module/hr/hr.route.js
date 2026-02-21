const express = require('express');
const controller = require('./hr.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post('/getListHr', authMiddleware, controller.getListHr);
router.post('/getHrDetail', authMiddleware, controller.getHrDetail);
router.post(
  '/updateHr',
  authMiddleware,
  checkPermission('HR_UPDATE'),
  controller.updateHr
);

module.exports = router;
