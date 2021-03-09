const Product = require('../models/product');
const Order = require('../models/order');
const user = require('../models/user');
//const User = require('../models/user');



exports.getIndex = (req, res) => {
   Product.find()
      .then(products => {
         res.render('shop/index', 
         {
            prods:products, 
            pageTitle:'Products List', 
            path:'/products'
         }); //usamos motor de plantillas	
      }).catch(err=> {
         console.log(err);
      });
}

exports.getCart = (req, res) => {
   req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(userCart => {  
         console.log(userCart.cart.items);   
         const cartInfo = {products: [...userCart.cart.items], totalCart: 0}
         res.render('shop/cart', {pageTitle:'Cart Items', path:'/cart', cart: cartInfo});
      })
      .catch(err=>{
         console.log("error:" + err);
      });
}

exports.postCart = (req, res) => {
   const prodId = req.body.productId;

   Product.findById(prodId).then(product => {
      return req.user.addToCart(product);
   }).then(_ =>{
      res.redirect('/cart');
   }).catch(err=>{
      console.log(err);
   })

}

exports.deleteItemCart = (req, res) => {
   const prodId = req.body.productId;
   req.user.deleteItemCart(prodId)
      .then( _ => {
         res.redirect('/cart')
      }).catch(err => {
         console.log(err);
      });
}

exports.getOrders = (req, res) => {
   Order.find()
   .then(orders =>{
      res.render('shop/orders', {
         pageTitle:'Pedidos', path:'/orders',
         orders: orders
      });
   })
   .catch(err=> console.log(err));
   
}

exports.postOrder = (req, res) => {
   req.user
   .populate('cart.items.productId')
   .execPopulate()
   .then(userCart => {
      console.log(userCart.cart.items);
      const products = userCart.cart.items.map(p => {
         return { productData: {...p.productId}, quantity: p.quantity }
      });
   
      const order = new Order({
         "products": products,
         "user": {"userId": userCart._id, "name": userCart.name, "email": userCart.email}
      });
      return order.save();
      //return order;
   }).then(result =>{
      console.log('Order created:',result);
      //remove items from cart
      return req.user.clearCart();
   })
   .then(result =>{
      console.log('Cart cleaned:', result);
      res.redirect('/orders');
   })
   .catch(err => console.log(err));
     
}


exports.getProducts =  (req, res) => {
   Product.find()
      .then(products => {
         res.render('shop/product-list', 
         {
            prods: products, 
            pageTitle:'Products List', 
            path:'/products'
         }); 
      });
}

exports.getProductDetails = (req, res) => {
   const prodId = req.params.productId;
   Product.findById(prodId).then(product => {
      res.render('shop/product-detail', {pageTitle:product.title, path:'/products', product: product});
   }); 
}

exports.getCheckOut= (req, res) => {
   res.render('shop/checkout', {pageTitle:'Products detail', path:'/products'});
}