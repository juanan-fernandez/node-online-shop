//generar tokens
const crypto = require('crypto');
//encriptar passwords
const bcrypt = require('bcryptjs');
//envio de emails
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

//variables entorno
const dotenv = require('dotenv');
dotenv.config();

const cliente = nodemailer.createTransport(
	sgTransport({
		auth: {
			api_key: process.env.SENDGRID_API_KEY,
		},
	})
);

//modelo usuarios
const User = require('../models/user');
const user = require('../models/user');

getLoginPage = (req, res) => {
	res.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		isAuth: false,
		errorMessage: req.flash('error'),
	});
};

postLogin = (req, res) => {
	//res.setHeader('Set-Cookie', 'loggedIn=true'); forma de crear una cookie
	const passwd = req.body.passwd;
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				req.flash('error', 'Invalid email.');
				return res.redirect('/login');
			}
			bcrypt
				.compare(passwd, user.password)
				.then((correctPassword) => {
					if (!correctPassword) {
						req.flash('error', 'Invalid password');
						return res.redirect('/login');
					}
					req.session.user = user;
					req.session.isLoggedIn = true;
					return req.session.save((err) => {
						console.log(err);
						res.redirect('/products');
					});
				})
				.catch((err) => {
					console.log(err);
					res.redirect('/login');
				});
		})
		.catch((err) => {
			console.log(err);
		});
};

postLogOut = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};

getSignUpPage = (req, res) => {
	res.render('auth/signup', {
		pageTitle: 'SignUp',
		path: '/signup',
		isAuth: false,
		errorMessage: req.flash('error'),
	});
};

postSignUp = (req, res) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				req.flash('error', 'Email account already exists in our database');
				return res.redirect('/signup');
			}
			return bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: hashedPassword,
					cart: { items: [] },
				});
				return newUser.save();
			});
		})
		.then(() => {
			res.redirect('/login');
			const email = {
				from: 'juanan.fernandez@gmail.com',
				to: req.body.email,
				subject: 'Subscription Confirmed',
				html: '<h1>Hello world! You successfully signed up!</h1>',
			};
			return cliente.sendMail(email).catch((err) => {
				console.log(err);
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

getResetPage = (req, res) => {
	res.render('auth/reset', {
		pageTitle: 'Reset Password',
		path: '/reset',
		isAuth: false,
		errorMessage: req.flash('error'),
		successMessage: req.flash('success'),
	});
};

postResetPasswd = (req, res) => {
	let token = '';
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				req.flash('error', 'This email account does not exists in our database');
				return res.redirect('/reset');
			}
			crypto.randomBytes(32, (err, buffer) => {
				if (err) {
					console.log(err);
					req.flash('error', 'Error happened trying to generate the token');
					return res.redirect('/reset');
				}
				token = buffer.toString('hex');
				user.resetToken = token;
				user.tokenExpiration = Date.now() + 1800000; //desde el momento actual + 1 hora en ms.
				//guardo los datos del token en la bd
				user.save().then(() => {
					const email = {
						from: 'juanan.fernandez@gmail.com',
						to: req.body.email,
						subject: 'Password Reset',
						html: `
							<p>You've requested for a password reset.</p>
							<p>To reset your password, please, click on the next link:</p>
							<p><a href="http://localhost:3000/reset/${token}">Reset my password</a></p>
						`,
					};
					return cliente
						.sendMail(email)
						.then(() => {
							req.flash('success', 'E-mail sent. Check your account, please.');
							res.redirect('/reset');
						})
						.catch((err) => {
							console.log(err);
						});
				});
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

getNewPasswordPage = (req, res) => {
	const token = req.params.token;
	const query = {
		resetToken: token,
		tokenExpiration: { $gt: Date.now() },
	};
	User.findOne(query).then((user) => {
		res.render('auth/new-password', {
			pageTitle: 'New Password',
			path: '/reset',
			isAuth: false,
			errorMessage: req.flash('error'),
			userId: user._id,
			passwdToken: token,
		}).catch((err) => {
			console.log(err);
		});
	});
};

postNewPassword = (req, res) => {
	const userId = req.body.userId;
	const newPasswd = req.body.password;
	const token = req.body.passwdToken;
	const query = {
		resetToken: token,
		tokenExpiration: { $gt: Date.now() },
		_id: userId,
	};
	let resultUser;
	User.findOne(query)
		.then((user) => {
			if (!user) {
				console.log('Not user found');
			}
			resultUser = user;
			return bcrypt.hash(newPasswd, 12);
		})
		.then((hashedPassword) => {
			resultUser.password = hashedPassword;
			resultUser.resetToken = undefined;
			resultUser.tokenExpiration = undefined;
			return resultUser.save();
		})
		.then((result) => {
			console.log(result);
			return res.redirect('login');
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = {
	getLoginPage,
	postLogin,
	postLogOut,
	getSignUpPage,
	postSignUp,
	getResetPage,
	postResetPasswd,
	getNewPasswordPage,
	postNewPassword,
};
