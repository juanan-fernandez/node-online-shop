const bcrypt = require('bcryptjs');
const User = require('../models/user');

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
				req.flash('error', 'Email account already exists in our data base');
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
		.then((result) => {
			console.log(result);
			res.redirect('/login');
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = { getLoginPage, postLogin, postLogOut, getSignUpPage, postSignUp };
