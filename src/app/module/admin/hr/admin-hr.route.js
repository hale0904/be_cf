const express = require('express');
const controller = require('./admin-hr.controller');

const router = express.Router();

// routes
router.post('/getListHr', controller.getListHr);
router.post('/getHrDetail', controller.getHrDetail);
router.post('/updateHr', controller.updateHr);

module.exports = router;
