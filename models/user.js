const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	resetToken: String,
	tokenExpiration: Date,
	cart: {
		items: [
			{
				productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
				quantity: { type: Number, required: true },
			},
		],
	},
});

userSchema.methods.addToCart = function (product) {
	let updatedCart = [];
	let newQty = 1;
	let productIndex = -1;

	updatedCart = [...this.cart.items];
	productIndex = this.cart.items.findIndex((p) => p.productId.toString() === product._id.toString());

	if (productIndex >= 0) {
		newQty = this.cart.items[productIndex].quantity + 1;
		updatedCart[productIndex].quantity = newQty;
	} else {
		updatedCart.push({ productId: product._id, quantity: newQty });
	}

	this.cart = { items: updatedCart };
	return this.save();
};

userSchema.methods.deleteItemCart = function (prodId) {
	const updatedCart = this.cart.items.filter((p) => p.productId.toString() !== prodId.toString());
	this.cart.items = [...updatedCart];
	return this.save();
};

userSchema.methods.clearCart = function () {
	this.cart.items = [];
	return this.save();
};
module.exports = mongoose.model('User', userSchema);

// const mongo = require('mongodb');
// const getDb = require('../util/database').getDb;

// class User {
//    constructor(name, email, passwd, id, cart) {
//       this.name = name;
//       this.email = email;
//       this.passwd = passwd;
//       this._id = id;
//       this.cart = cart; // {items:[]}
//    }

//    save() {
//       const db = getDb();
//       return db.collection('users').insertOne(this)
//       .then(result => {
//          console.log(result);
//       })
//       .catch(err=> {
//          console.log(err)
//       })
//    }

//    cleanUpCart(productIdsCart) {
//       let result = 0;
//       const db = getDb();

//       const promises = productIdsCart.map(p => {
//          return db.collection('products').findOne({ _id: new mongo.ObjectID(p) })
//             .then(product => {
//                if (!product) {
//                   return this.deleteItemCart(p)
//                      .then(() => {
//                         return result=result+1
//                      });
//                }
//          });
//       });

//       return Promise.all(promises).then( _ => result);
//    }

//    getCart() {
//       const db = getDb();
//       const productIds = this.cart.items.map(p => p.productId);
//       return db.collection('products').find({_id: {$in: productIds}})
//       .toArray()
//       .then(products => {
//          if (productIds.length !== products.length) {
//             this.cleanUpCart(productIds).then(result => {
//                console.log(result);
//                console.log('clean:', result > 0 ? `Deleted ${result} non existent products` : '0');
//                return products;
//             });
//          }
//          return products;
//       })
//       .then(products => {
//          return products.map(p =>{
//             return {
//                      ...p,
//                      quantity: this.cart.items.find(i => {
//                         return i.productId.toString() === p._id.toString();
//                      }).quantity
//                   }
//          });
//       }).catch(err=> {
//          console.log(err);
//       });
//    }

//    deleteItemCart(prodId) {
//       const updatedCart = this.cart.items.filter(item => item.productId.toString() !== prodId.toString());
//       this.cart.items = [...updatedCart];

//       const db = getDb();
//       return db.collection('users').updateOne(
//          {_id: new mongo.ObjectID(this._id)},
//          {$set: {"cart.items": this.cart.items}}
//       );
//    }

//    static findById(userId) {
//       const db = getDb();
//       return db.collection('users').findOne({_id: new mongo.ObjectID(userId)});
//    }

//    addOrder() {
//       const db = getDb();
//       return this.getCart()
//          .then(cart => {
//             const order = {
//                "items": cart,
//                "user": {"userId": new mongo.ObjectID(this._id), "name": this.name, "email": this.email}
//             };
//             return db.collection('orders').insertOne(order)
//          })
//          .then(_ => {
//             this.cart.items=[];
//             return db.collection('users').updateOne(
//                {_id: new mongo.ObjectID(this._id)},
//                {$set: {"cart.items": [] }}
//             )
//          }).catch(err=>{
//             console.log(err);
//          });
//    }

//    getOrders() {
//       const db = getDb();
//       return db.collection('orders').find({"user.userId": new mongo.ObjectId(this._id)})
//          .toArray()
//          .then(orders => {
//             return orders
//          })
//          .catch(err=>{
//             console.log(err);
//          })
//    }
// }

// module.exports = User;
