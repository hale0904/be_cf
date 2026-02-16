const express = require('express');

const authAdminRoutes = require('../module/admin/auth/admin-auth.route');

const router = express.Router();

// Admin
router.use('/api/ad', [authAdminRoutes]);

module.exports = router;
