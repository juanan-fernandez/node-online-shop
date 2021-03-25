const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogOut);

router.get('/signup', authController.getSignUpPage);
router.post('/signup', authController.postSignUp);

router.get('/reset', authController.getResetPage);
router.post('/reset', authController.postResetPasswd);

router.get('/reset/:token', authController.getNewPasswordPage);
router.post('/newpassword', authController.postNewPassword);
module.exports = router;
