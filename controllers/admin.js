//express-validator para validar formularios
const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	//asegurar las rutas en los ficheros de rutas con un middleware video 258
	// if (!req.session.isLoggedIn) {
	// 	return res.redirect('/login');
	// }
	res.render('admin/edit-product', {
		pageTitle: 'Add Prod',
		path: '/admin/add-product',
		product: null,
		errorMessage: [],
		validationErrs: [],
	});
};

exports.postAddProduct = (req, res) => {
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const imageUrl = req.body.imageUrl;
	const userId = req.session.user;

	//data validation
	const errors = validationResult(req);
	let errMessages = '';
	if (!errors.isEmpty()) {
		const arrErrors = errors.array();
		arrErrors.forEach(errorItem => {
			errMessages = errMessages + `${errorItem.msg}</br>`;
		});
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			errorMessage: errMessages,
			product: {
				title: title,
				price: price,
				description: description,
				imageUrl: imageUrl,
				userId: userId,
			},
			validationErrs: arrErrors,
		});
	}

	//si llegamos aquí, los datos son válidos
	const product = new Product({
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl,
		userId: userId,
	});
	product
		.save()
		.then(result => {
			console.log(result);
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log(err);
			throw err;
		});
};

exports.getEditProduct = (req, res) => {
	const prodId = req.params.productId;

	Product.findById({ _id: prodId })
		.then(product => {
			res.render('admin/edit-product', {
				pageTitle: 'Edit Prod',
				path: '/admin/edit-product',
				product: product,
				errorMessage: [],
				validationErrs: [],
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res) => {
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const imageUrl = req.body.imageUrl;
	const productId = req.body.productId;

	//data validation
	const errors = validationResult(req);
	let errMessages = '';
	if (!errors.isEmpty()) {
		const arrErrors = errors.array();
		arrErrors.forEach(errorItem => {
			errMessages = errMessages + `${errorItem.msg}</br>`;
		});
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			errorMessage: errMessages,
			product: {
				title: title,
				price: price,
				description: description,
				imageUrl: imageUrl,
				_id: productId,
			},
			validationErrs: arrErrors,
		});
	}

	Product.findById(productId)
		.then(product => {
			console.log(product.userId, req.user._id);
			if (product.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/');
			}
			product.title = title;
			product.price = price;
			product.description = description;
			product.imageUrl = imageUrl;
			return product.save().then(result => {
				console.log('Updated product!');
				res.redirect('/admin/products');
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postDeleteProduct = (req, res) => {
	const prodId = req.body.productId;
	Product.deleteOne({ _id: prodId, userId: req.user_id })
		.then(result => {
			console.log('Deleted:', result); //en result viene el nº de registros eliminados
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getProducts = (req, res) => {
	Product.find({ userId: req.user._id }).then(products => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Products List',
			path: '/admin/products',
		}); //usamos motor de plantillas
	});
};
