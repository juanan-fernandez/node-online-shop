const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');


getCartFromFile = (cb) => {
   fs.readFile(p, (err, fileData) => {
      if(err) {
         cb({});
      }else{
         cb(JSON.parse(fileData));
      }  
   });
}

module.exports = class Cart {

   static AddProduct (id, productPrice, title) {
      fs.readFile(p, (err, fileData) => {
         let cart = {products:[], totalPrice: 0};
         let updatedProduct;
         if(!err){
            cart = JSON.parse(fileData);
         }
         const indexProduct = cart.products.findIndex( p => p.id === id );
         if (indexProduct >= 0) {
            updatedProduct = {...cart.products[indexProduct]};
            updatedProduct.qty  = updatedProduct.qty + 1;
            cart.products[indexProduct] = {...updatedProduct};
         }else{
            cart.products = [...cart.products, {id:id, qty:1, title:title, price: +productPrice}]
         }
         cart.totalPrice = cart.totalPrice + +productPrice;
         fs.writeFile(p,JSON.stringify(cart), err => {
            console.log(err);
         });
      });
   }

   static removeFromCart(id) {
      getCartFromFile(cart =>{
         if(!cart){
            return;
         }
         const deletedProduct= cart.products.find(p => p.id === id);
         if (!deletedProduct) {
            return;
         }
         const updatedProducts =  cart.products.filter(p => p.id !== id);
         const totalPrice = cart.totalPrice - (deletedProduct.qty * deletedProduct.price);
         const updatedCart = {products:[...updatedProducts], totalPrice: totalPrice}
         fs.writeFile(p, JSON.stringify(updatedCart), err => {
            console.log(err);
         });         
      });
   }

   static getCart(cb) {
      getCartFromFile(cart => {
         if(!cart) {
            cb({});
         }else {
            cb(cart);
         }
      });
   }

}//fin clase