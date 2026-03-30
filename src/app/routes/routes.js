const express = require('express');

const authRoutes = require('../module/auth/auth.route');
const hrRoutes = require('../module/hr/staff.route');
const featureRoutes = require('../module/feature/feature.route');
const menuDataRoutes = require('../module/menu/menu.route');
const accountRoutes = require('../module/accountUser/accountUser.route');
const categoryRoutes = require('../module/products/category/category.route');
const productRoutes = require('../module/products/product/product.route');
const uploadRoute = require('../../uploads/upload.route');
const { authMiddleware } = require('../middlewares/auth.middleware');
const typeHrRoute = require('../module/typeHr/typeHr.route');

const router = express.Router();

// Public
router.use('/api/auth', authRoutes);
router.use('/api', uploadRoute);

// Protected
router.use('/api', authMiddleware, [
  hrRoutes,
  featureRoutes,
  menuDataRoutes,
  accountRoutes,
  categoryRoutes,
  productRoutes,
  typeHrRoute,
]);

module.exports = router;
