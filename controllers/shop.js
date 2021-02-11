const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
   res.render('shop/index', {pageTitle: 'Home', path:'/'});
}

exports.getCart = (req, res, next) => {
   res.render('shop/cart',{pageTitle:'Cart Items', path:'/cart'});
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

exports.getProductsDetails = (req, res) => {
   res.render('shop/product-detail', {pageTitle:'Products detail', path:'/product-detail'});
}

exports.getCheckOut= (req, res) => {
   res.render('shop/checkout', {pageTitle:'Products detail', path:'/product-detail'});
}