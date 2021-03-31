const { check, body } = require('express-validator');
const express = require('express');
const router = express.Router();
const User = require('../models/user');

const authController = require('../controllers/auth');

router.get('/login', authController.getLoginPage);
router.post(
	'/login',
	[
		body('email', 'Please enter a valid e-mail.').isEmail(),
		body('passwd', 'The password must contain only letters and numbers and must be at least 5 characters')
			.isLength({ min: 5 })
			.isAlphanumeric(),
	],
	authController.postLogin
);

router.post('/logout', authController.postLogOut);

router.get('/signup', authController.getSignUpPage);
router.post(
	'/signup',
	[
		check('email')
			.isEmail()
			.withMessage('Please enter a valid e-mail')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then(user => {
					if (user) {
						return Promise.reject('Email account already exists in our database');
					}
				});
			}),

		body('password', 'The password must contain only letters and numbers and must be at least 5 characters')
			.isLength({ min: 5 })
			.isAlphanumeric(),

		body('confirmPassword', 'The password and password confirm are NOT EQUAL.').custom((value, { req }) => {
			if (value !== req.body.password) return false;
			return true;
		}),
	],
	authController.postSignUp
);

router.get('/reset', authController.getResetPage);
router.post('/reset', authController.postResetPasswd);

router.get('/reset/:token', authController.getNewPasswordPage);
router.post('/newpassword', authController.postNewPassword);
module.exports = router;
