const Product = require('../models/product');

exports.getAddProduct= (req, res, next) => {
   res.render('admin/add-product', {
			pageTitle:'Add Prod', 
			path:'/admin/add-product'
	   }
   );
}

exports.postAddProduct = (req, res, next) => {
	const product = new Product (req.body.title, req.body.imageUrl, req.body.description, req.body.price);
   product.save();
	res.redirect('/products');
}

exports.getEditProduct = (req, res, next) => {
   res.render('admin/edit-product', {
      pageTitle: 'Edit-Prod',
      path: '/admin/edit-product'
   });
}

exports.postEditProduct = (req, res, next) => {
   res.redirect('admin/products');
}

exports.postDeleteProduct = (req, res) => {
   res.redirect('admin/products');
}

exports.getProducts =  (req, res) => {
   const products = Product.fetchAll(products => {
      res.render('admin/products', 
      {
         prods:products, 
         pageTitle:'Products List', 
         path:'/products',
      }); //usamos motor de plantillas
   });

}