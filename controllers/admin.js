const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Prod',
		path: '/admin/add-product',
		product: null,
		isAuth: req.session.isLoggedIn,
	});
};

exports.postAddProduct = (req, res) => {
	const product = new Product({
		title: req.body.title,
		price: req.body.price,
		description: req.body.description,
		imageUrl: req.body.imageUrl,
		userId: req.session.user,
	});
	product
		.save()
		.then((result) => {
			console.log(result);
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
};

exports.getEditProduct = (req, res) => {
	const prodId = req.params.productId;

	Product.findById({ _id: prodId })
		.then((product) => {
			res.render('admin/edit-product', {
				pageTitle: 'Edit Prod',
				path: '/admin/edit-product',
				product: product,
				isAuth: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res) => {
	Product.findById(req.body.productId).then((product) => {
		product.title = req.body.title;
		product.price = req.body.price;
		product.description = req.body.description;
		product.imageUrl = req.body.imageUrl;
		product
			.save()
			.then((result) => {
				console.log(result);
				res.redirect('/admin/products');
			})
			.catch((err) => {
				console.log(err);
			});
	});
};

exports.postDeleteProduct = (req, res) => {
	const prodId = req.body.productId;
	Product.findByIdAndDelete(prodId)
		.then((result) => {
			console.log('Deleted:', result); //en result viene el nº de registros eliminados
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProducts = (req, res) => {
	Product.find().then((products) => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Products List',
			path: '/admin/products',
			isAuth: req.session.isLoggedIn,
		}); //usamos motor de plantillas
	});
};
