const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Prod',
		path: '/admin/add-product',
		product: null,
	});
};

exports.postAddProduct = (req, res, next) => {
	const product = new Product(null, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
	product.save().then(() => {
      res.redirect('/products');
   }).catch(err =>{
      console.log(err);
   });
};

exports.getEditProduct = (req, res) => {
	const prodId = req.params.productId;
	Product.fetchProduct(prodId).then(([product]) => {
      
		res.render('admin/edit-product', {
			pageTitle: 'Edit Prod',
			path: '/admin/edit-product',
			product: product[0],
		});
	});
};

exports.postEditProduct = (req, res, next) => {
	const product = new Product(
		req.body.productId,
		req.body.title,
		req.body.imageUrl,
		req.body.description,
		req.body.price
	);

	product.save().then((result) => {
         res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postDeleteProduct = (req, res) => {
	const prodId = req.body.productId;
	Product.deleteById(prodId);
	res.redirect('/admin/products');
};

exports.getProducts = (req, res) => {
	const products = Product.fetchAll().then(rs => {
      const [rows] = rs;
		res.render('admin/products', {
			prods: rows,
			pageTitle: 'Products List',
			path: '/products',
		}); //usamos motor de plantillas
	});
};
