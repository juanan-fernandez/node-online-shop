const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
   const products = Product.fetchAll(products => {
      res.render('shop/index', 
      {
         prods:products, 
         pageTitle:'Products List', 
         path:'/products'
      }); //usamos motor de plantillas
   });
}

exports.getCart = (req, res, next) => {
   res.render('shop/cart',{pageTitle:'Cart Items', path:'/cart'});
}

exports.postCart = (req, res) => {
   const prodId = req.body.productId;
   const product = Product.fetchProduct(id, product => {
      Cart.AddProduct(prodId, product.price, product.tittle);
   });
   res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
   res.render('shop/orders',{pageTitle:'Pedidos', path:'/orders'});
}


exports.getProducts =  (req, res) => {
   const products = Product.fetchAll(products => {
      res.render('shop/product-list', 
      {
         prods:products, 
         pageTitle:'Products List', 
         path:'/products'
      }); //usamos motor de plantillas
   });
}

exports.getProductDetails = (req, res) => {
   const prodId = req.params.productId;
   const product = Product.fetchProduct(prodId, product => {
      res.render('shop/product-detail', {pageTitle:product.title, path:'/products', product: product});
   });
   
}

exports.getCheckOut= (req, res) => {
   res.render('shop/checkout', {pageTitle:'Products detail', path:'/products'});
}