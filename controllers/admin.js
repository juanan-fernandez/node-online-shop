//express-validator para validar formularios
const { validationResult } = require('express-validator');

const Product = require('../models/product');
const fileHelper = require('../util/file');

const errHandler = (err, next) => {
	const error = new Error(err);
	error.httpStatusCode = 500;
	return next(error);
};

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

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const image = req.file;
	const userId = req.session.user;

	//data validation
	const errors = validationResult(req);
	let errMessages = '';
	if (!image) errMessages = `File must be a valid image forma file</br>`;
	if (!errors.isEmpty() || errMessages) {
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
		imageUrl: image.path,
		userId: userId,
	});

	return product
		.save()
		.then(result => {
			//console.log(result);
			return res.redirect('/admin/products');
		})
		.catch(err => {
			//res.redirect('/500'); //para no tener que hacer el redirect 500 en cada error
			//usamos un middleware
			//podemos poner este código en una función para ser llamado desde cada catch
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
			// errorHandler(err);
		});
};

exports.getEditProduct = (req, res, next) => {
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
			errorHandler(err, next);
		});
};

exports.postEditProduct = (req, res, next) => {
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const image = req.file;
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
				_id: productId,
			},
			validationErrs: arrErrors,
		});
	}

	Product.findById(productId)
		.then(product => {
			if (product.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/');
			}
			product.title = title;
			product.price = price;
			product.description = description;
			if (image) {
				fileHelper.deleteFile(product.imageUrl);
				product.imageUrl = image.path;
			}
			return product.save().then(result => {
				console.log('Updated product!');
				res.redirect('/admin/products');
			});
		})
		.catch(err => {
			errHandler(err, next);
		});
};

exports.deleteProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then(prod => {
			if (!prod) {
				return next(new Error('Unable to find the product to delete'));
			}
			fileHelper.deleteFile(prod.imageUrl);
			return Product.deleteOne({ _id: prodId, userId: req.user._id });
		})
		.then(result => {
			console.log('Deleted:', result['deletedCount']); //en result viene el nº de registros eliminados
			res.status(200).json({ message: 'Product deleted.' });
		})
		.catch(err => {
			res.status(500).json({ message: 'ERROR: Deleting product.' });
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
