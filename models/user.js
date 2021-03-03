const mongo = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
   constructor(name, email, passwd, id, cart) {
      this.name = name;
      this.email = email;
      this.passwd = passwd;
      this._id = id;
      this.cart = cart; // {items:[]}
   }

   save() {
      const db = getDb();
      return db.collection('users').insertOne(this)
      .then(result => {
         console.log(result);
      })
      .catch(err=> {
         console.log(err)
      })
   }

   addToCart(product) {

      let newQty = 1;
      let cartProductIndex = -1;
      let updatedCartItems = [];

      if(this.cart.items) {
         updatedCartItems = [...this.cart.items];
         cartProductIndex = this.cart.items.findIndex (cp => { 
            return cp.productId.toString() === product._id.toString();
         });
      }

      if (cartProductIndex >= 0) { //el producto ya está en el carrito.
         newQty = this.cart.items[cartProductIndex].quantity + 1;
         updatedCartItems[cartProductIndex].quantity = newQty;
      }else{
         updatedCartItems.push({ productId: new mongo.ObjectID(product._id), quantity: newQty })
      }
     
      const updatedCart = {items: updatedCartItems};
      const db = getDb();
      return db.collection('users').updateOne(
         {_id: new mongo.ObjectID(this._id)},
         {$set: {cart: updatedCart}}
      );
   }

   async cleanUpCart(productIdsCart) {
      let result = 0;
      const db = getDb();
      const resolve = await new Promise(() => {
         productIdsCart.forEach(p => {
            db.collection('products').findOne({ _id: new mongo.ObjectID(p) })
               .then(product => {
                  if (!product) {
                     this.deleteItemCart(p)
                        .then(() => {
                           result = +result + 1;
                        });
                  }
               });
            });
         });
      resolve.resolve(result > 0 ? `Deleted ${result} non existent products` : 'ok');
      console.log('test'); 
   }
 
   getCart() {
      const db = getDb();
      const productIds = this.cart.items.map(p => p.productId);
      return db.collection('products').find({_id: {$in: productIds}})
      .toArray()      
      .then(products => {
         if (productIds.length !== products.length) {
            this.cleanUpCart(productIds).then(result => {
               console.log('clean:', result);
               return products;
            });
         }
         return products;
      })
      .then(products => {
         return products.map(p =>{
            return {
                     ...p, 
                     quantity: this.cart.items.find(i => {
                        return i.productId.toString() === p._id.toString();
                     }).quantity
                  }
         });
      }).catch(err=> {
         console.log(err);
      });
   }

   deleteItemCart(prodId) {
      const updatedCart = this.cart.items.filter(item => item.productId.toString() !== prodId.toString());
      this.cart.items = [...updatedCart];
      
      const db = getDb();
      return db.collection('users').updateOne(
         {_id: new mongo.ObjectID(this._id)},
         {$set: {"cart.items": this.cart.items}}
      );
   }

   static findById(userId) {
      const db = getDb();
      return db.collection('users').findOne({_id: new mongo.ObjectID(userId)});
   }

   addOrder() {
      const db = getDb();
      return this.getCart()
         .then(cart => {
            const order = {
               "items": cart,
               "user": {"userId": new mongo.ObjectID(this._id), "name": this.name, "email": this.email}
            };
            return db.collection('orders').insertOne(order)
         })
         .then(_ => {
            this.cart.items=[];
            return db.collection('users').updateOne(
               {_id: new mongo.ObjectID(this._id)},
               {$set: {"cart.items": [] }}
            )
         }).catch(err=>{
            console.log(err);
         });
   }

   getOrders() {
      const db = getDb();
      return db.collection('orders').find({"user.userId": new mongo.ObjectId(this._id)})
         .toArray()
         .then(orders => {
            return orders
         })
         .catch(err=>{
            console.log(err);
         })
   }
}


module.exports = User;
