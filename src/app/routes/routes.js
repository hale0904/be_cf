const express = require('express');

const authRoutes = require('../module/auth/auth.route');
const hrRoutes = require('../module/hr/hr.route');
const featureRoutes = require('../module/feature/feature.route');
const menuDataRoutes = require('../module/menu/menu.route');
const accountRoutes = require('../module/accountUser/accountUser.route');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public
router.use('/api/auth', authRoutes);

// Protected
router.use('/api', authMiddleware, [
  hrRoutes,
  featureRoutes,
  menuDataRoutes,
  accountRoutes,
]);

module.exports = router;
