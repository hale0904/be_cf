const express = require('express');
const controller = require('./feature.controller');

const router = express.Router();

// routes
router.post('/getListFeature', controller.getListFeature);
router.post('/updateFeature', controller.updateFeature);

module.exports = router;
