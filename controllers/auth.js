const bcrypt = require('bcryptjs');
const User = require('../models/user');

getLoginPage = (req, res) => {
	res.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		isAuth: false,
	});
};

postLogin = (req, res) => {
	//res.setHeader('Set-Cookie', 'loggedIn=true'); forma de crear una cookie
	const passwd = req.body.passwd;
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				res.redirect('/login');
			}
			bcrypt
				.compare(passwd, user.password)
				.then((correctPassword) => {
					if (correctPassword) {
						req.session.user = user;
						req.session.isLoggedIn = true;
						return req.session.save((err) => {
							console.log(err);
							res.redirect('/products');
						});
					}
					res.redirect('/login');
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
	});
};

postSignUp = (req, res) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				console.log('entro');
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
			res.redirect('/login');
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = { getLoginPage, postLogin, postLogOut, getSignUpPage, postSignUp };
