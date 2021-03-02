const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Prod',
		path: '/admin/add-product',
		product: null,
	});
};

exports.postAddProduct = (req, res) => {
	const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl, req.user._id);
	product.save()
		.then(_ =>{
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log(err);
			throw err;
		});	
};

exports.getEditProduct = (req, res) => {
	const prodId = req.params.productId;

	Product.findById(prodId)
		.then(product => {
			res.render('admin/edit-product', {
				pageTitle: 'Edit Prod',
				path: '/admin/edit-product',
				product: product,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res) => {
	const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl);
	product.update(req.body.productId)
		.then((result) => {
			console.log(result);
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postDeleteProduct = (req, res) => {
	const prodId = req.body.productId;
	Product.deleteById(prodId)
		.then((result) => {
			console.log(result); //en result viene el nº de registros eliminados
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};

// exports.postDeleteProduct = (req, res) => { //otra forma de hacerlo.
// 	Product.findByPk(req.body.productId)
// 		.then((product) => {
// 			return product.destroy();
// 		})
// 		.then((result) => {
// 			console.log(result);
//				res.redirect('/admin/products');
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// };

exports.getProducts = (req, res) => {
	Product.fetchAll().then((products) => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Products List',
			path: '/admin/products',
		}); //usamos motor de plantillas
	});
};
