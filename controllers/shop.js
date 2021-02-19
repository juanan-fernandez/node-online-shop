const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
   Product.fetchAll().then( rs => {
      const [rows, fieldData] = rs;
		res.render('shop/index', 
      {
         prods:rows, 
         pageTitle:'Products List', 
         path:'/products'
      }); //usamos motor de plantillas	
   }).catch(err=> {
      console.log(err);
   });
   
}

exports.getCart = (req, res, next) => {
   Cart.getCart(cart => {
      Product.fetchAll.then(allProducts => {
         //voy a montar un objeto con información de ambos modelos
         let prodsInCart = [];
         let prod = {};
         cart.products.forEach(p => {
            prod = allProducts.find(ap => ap.id === p.id);
            prod = {...prod, qty: p.qty, price: p.price}
            prodsInCart.push(prod);
         });
         const cartInfo = {products: [...prodsInCart], totalCart: cart.totalPrice}
         res.render('shop/cart', {pageTitle:'Cart Items', path:'/cart', cart: cartInfo});
      });
      
   });
   
}

exports.postCart = (req, res) => {
   const prodId = req.body.productId;
   Product.fetchProduct(prodId, product => {
      Cart.AddProduct(prodId, product.price, product.title);
   });
   res.redirect('/cart');
}

exports.deleteItemCart = (req, res) => {
   Cart.removeFromCart(req.body.productId);
   res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
   res.render('shop/orders',{pageTitle:'Pedidos', path:'/orders'});
}


exports.getProducts =  (req, res) => {
   Product.fetchAll().then( rs => {
      const [rows, fieldsData] = rs;
      res.render('shop/product-list', 
      {
         prods: rows, 
         pageTitle:'Products List', 
         path:'/products'
      }); //usamos motor de plantillas
   });
}

exports.getProductDetails = (req, res) => {
   const prodId = req.params.productId;
   Product.fetchProduct(prodId).then(rs => {
      const [row] = rs;
      const [product] = row;
      res.render('shop/product-detail', {pageTitle:product.title, path:'/products', product: product});
   }); 
}

exports.getCheckOut= (req, res) => {
   res.render('shop/checkout', {pageTitle:'Products detail', path:'/products'});
}