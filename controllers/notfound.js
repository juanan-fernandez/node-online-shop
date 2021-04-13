exports.getNotFound = (req, res, next) => {
	res.status(404).render('404', { pageTitle: '404 - Página no encontrada', path: '', isAuth: req.session.isLoggedIn });
};

exports.getServerError = (req, res, next) => {
	res.status(500).render('500', { pageTitle: '500 - Error de Servicor', path: '', isAuth: req.session.isLoggedIn });
};
