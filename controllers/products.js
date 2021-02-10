const Product = require('../models/product');

exports.getAddProduct= (req, res, next) => {
   res.render('add-product', {
			pageTitle:'Add Prod', 
			path:'/admin/add-product',
			formsCSS: true
	   }
   );
}

exports.postAddProduct = (req, res, next) => {
	const product = new Product (req.body.title);
   product.save();
	res.redirect('/');
}

exports.getProducts =  (req, res) => {
   const products = Product.fetchAll(products => {
      res.render('shop', 
      {
         prods:products, 
         pageTitle:'Products List', 
         path:'/',
         hasProducts:products.length>0,
         productCSS: true
      }); //usamos motor de plantillas
   });

}