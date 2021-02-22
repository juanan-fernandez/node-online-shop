const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Prod',
		path: '/admin/add-product',
		product: null,
	});
};

exports.postAddProduct = (req, res, next) => {
	req.user.createProduct({
		title: req.body.title,
		imageUrl: req.body.imageUrl,
		description: req.body.description,
		price: req.body.price
	}).then( _ => {
		res.redirect('/admin/products');
	})
	.catch((err) => {
		console.log(err);
	});

};

exports.getEditProduct = (req, res) => {
	const prodId = req.params.productId;

	//otra aproximación usando el findAll con un where para devolver los registros que nos interesan
	// Product.findAll({where:{ productId: prodId}}).then(products=>{
	// 	res.render('admin/edit-product', {
	// 		pageTitle: 'Edit Prod',
	// 		path: '/admin/edit-product',
	// 		product: products[0] //se devuelve un array de registros
	// 	});
	// }).catch(err =>{
	// 	console.log(err);
	// });

	Product.findByPk(prodId)
		.then((product) => {
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
	Product.findByPk(req.body.productId)
		.then((product) => {
			product.title = req.body.title;
			product.imageUrl = req.body.imageUrl;
			product.description = req.body.description;
			product.price = req.body.price;
			return product.save();
		})
		.then((result) => {
			console.log('Product updated!');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postDeleteProduct = (req, res) => {
	const prodId = req.body.productId;
	Product.destroy({ where: { productId: prodId } })
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
	Product.findAll().then((products) => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Products List',
			path: '/admin/products',
		}); //usamos motor de plantillas
	});
};
