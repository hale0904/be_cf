const express = require('express');
const controller = require('./feature.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post('/getListFeature', authMiddleware, controller.getListFeature);
router.post(
  '/updateFeature',
  authMiddleware,
  checkPermission('ADMIN_CREATE'),
  controller.updateFeature
);

module.exports = router;
