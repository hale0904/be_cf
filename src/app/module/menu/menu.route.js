const express = require('express');
const controller = require('./menu.controller');

const router = express.Router();

// routes
router.post('/getListMenu', controller.getListMenu);
router.post('/updateMenu', controller.updateMenu);

module.exports = router;
