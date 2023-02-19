const express = require('express');

const router = express.Router();
const homeController = require('../controllers/controller');

router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/post',require('./posts'));

module.exports = router;
console.log("router loaded");


