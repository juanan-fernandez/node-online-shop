const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogOut);

module.exports = router;
