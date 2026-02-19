const express = require('express');

const authAdminRoutes = require('../module/auth/auth.route');
const hrAdminRoutes = require('../module/hr/hr.route');
const featureRoutes = require('../module/feature/feature.route');
const menuDataRoutes = require('../module/menu/menu.route');
const router = express.Router();

// Admin
router.use('/api/us', [
  authAdminRoutes,
  hrAdminRoutes,
  featureRoutes,
  menuDataRoutes,
]);

module.exports = router;
