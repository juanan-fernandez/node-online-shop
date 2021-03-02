const Product = require('../models/product');
//const User = require('../models/user');

//const Order = require('../models/order');

exports.getIndex = (req, res) => {
   Product.fetchAll()
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
   req.user.getCart()
      .then(prodsInCart => {      
         const cartInfo = {products: [...prodsInCart], totalCart: 0}
         res.render('shop/cart', {pageTitle:'Cart Items', path:'/cart', cart: cartInfo});
      })
      .catch(err=>{
         console.log(err);
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

   // let fetchedCart;
   // let cartQuantity = 1;
   // req.user.getCart()
   //    .then(cart => {
   //       fetchedCart = cart;
   //       return cart.getProducts({where: {id: prodId}})
   //    })
   //    .then(products => {
   //       let product = null;
   //       if (products.length > 0) product = products[0];
   //       if (product) {
   //          cartQuantity = +product.cartitems.quantity + 1;
   //          return product;
   //       }
   //       //si el producto no existía: añadir el producto al carrito
   //       return Product.findByPk(prodId)
   //    })
   //    .then(product => {
   //          console.log(product);
   //          return fetchedCart.addProduct(product, {through: {quantity: cartQuantity}})
   //    })
   //    .then( _ => {
   //       res.redirect('/cart');      
   //    })
   //    .catch(err => {
   //       console.log(err)
   //    });
}

exports.deleteItemCart = (req, res) => {
   const prodId = req.body.productId;
   req.user.getCart()
      .then(cart => {
         return cart.getProducts({where:{id: prodId}})
      })
      .then(prodsInCart => {
         const product = prodsInCart[0];
         return product.cartitems.destroy()
      })
      .then(result=>{
         console.log(result);
         res.redirect('/cart');
      })
      .catch(err=>{
         console.log(err);
      });   
}

exports.getOrders = (req, res, next) => {
   req.user.getOrders({include: ['products']})
   .then(orders =>{
      res.render('shop/orders', {
         pageTitle:'Pedidos', path:'/orders',
         orders: orders
      });
   })
   .catch(err=> console.log(err));
   
}

exports.postOrder = (req, res) => {
   let fetchedCart;
   req.user.getCart()
      .then(cart=>{
         fetchedCart = cart;
         return cart.getProducts()
      })
      .then(products => {
         req.user.createOrder()
            .then(order =>{
               return order.addProduct(
                  products.map(product => {
                     product.orderitem = {quantity: product.cartitems.quantity};
                     return product;
                  })
               )
            })
            .catch(err=> console.log(err))
      })
      .then(result => {
         return fetchedCart.setProducts(null)
      })
      .then(result => {
         res.redirect('/orders');
      })
      .catch(err=> console.log(err))
}


exports.getProducts =  (req, res) => {
   Product.fetchAll()
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