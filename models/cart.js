const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');


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
            cart.products = [...cart.products, {id:id, qty:1, title:title}]
         }
         cart.totalPrice = cart.totalPrice + productPrice;
         fs.writeFile(p,JSON.stringify(cart), err => {
            console.log(err);
         });
      });
   }

}