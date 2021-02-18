const Product = require('../models/product');

exports.getAddProduct= (req, res, next) => {
   res.render('admin/edit-product', {
			pageTitle:'Add Prod', 
			path:'/admin/add-product',
         product: {}
	   }
   );
}

exports.postAddProduct = (req, res, next) => {
   const product = new Product (null, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
   product.save();
	res.redirect('/products');
}

exports.getEditProduct = (req, res) => {
   const prodId =req.params.productId;
   Product.fetchProduct(prodId, product => {
      res.render('admin/edit-product', {
                  pageTitle: 'Edit Prod',
                  path: '/admin/edit-product',
                  product: product
               }
      );
   });
}

exports.postEditProduct = (req, res, next) => {
   const product = new Product (req.body.productId, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
   product.save();
   res.redirect('/admin/products');
}

exports.postDeleteProduct = (req, res) => {
   const prodId = req.body.productId;
   Product.deleteById(prodId);
   res.redirect('/admin/products');
}

exports.getProducts =  (req, res) => {
   const products = Product.fetchAll(products => {
      res.render('admin/products', 
      {
         prods: products, 
         pageTitle:'Products List', 
         path:'/products',
      }); //usamos motor de plantillas
   });

}