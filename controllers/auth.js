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
	User.findById('60468a8832b5705238a0891e')
		.then((user) => {
			console.log(user);
			req.session.user = user;
			req.session.isLoggedIn = true;
			req.session.save((err) => {
				console.log(err);
				res.redirect('/products');
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

postSignUp = (req, res) => {};

module.exports = { getLoginPage, postLogin, postLogOut, getSignUpPage, postSignUp };
