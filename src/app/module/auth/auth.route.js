const express = require('express');
const controller = require('./auth.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const {
  checkPermission,
} = require('../../middlewares/checkPermission.middleware');
const router = express.Router();

// routes
router.post(
  '/register',
  authMiddleware,
  checkPermission('HR_CREATE'),
  controller.register
);
router.post('/login', controller.login);
router.post('/logout', authMiddleware, controller.logout);

module.exports = router;
