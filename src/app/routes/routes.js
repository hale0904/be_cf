const express = require('express');

const authAdminRoutes = require('../module/admin/auth/admin-auth.route');
const hrAdminRoutes = require('../module/admin/hr/admin-hr.route');
const router = express.Router();

// Admin
router.use('/api/ad', [authAdminRoutes, hrAdminRoutes]);

module.exports = router;
