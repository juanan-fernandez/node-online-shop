const User = require('../models/user');

getLoginPage = (req, res) => {
	res.render('shop/login', {
		pageTitle: 'Login',
		path: '/login',
		isAuth: false,
	});
};

postLogin = (req, res) => {
	//console.log(req.body.email, req.body.passwd);
	//validamos usuario y password
	//res.setHeader('Set-Cookie', 'loggedIn=true'); forma de crear una cookie
	User.findById('60468a8832b5705238a0891e')
		.then((user) => {
			console.log(user);
			req.session.user = user;
			req.session.isLoggedIn = true;
			res.redirect('/products');
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

module.exports = { getLoginPage, postLogin, postLogOut };
