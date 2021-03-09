const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
   title: { type: String, required: true },
   price: { type: Number, required: true},
   description: { type: String, required: true },
   imageUrl: { type: String, required: true },
   userId : {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Product', productSchema);

// const mongo = require('mongodb')
// const getDb = require ('../util/database').getDb;

// class Product {
//    constructor(title, price, description, imageUrl, userId) {
//       this.title = title;
//       this.price = price;
//       this.description = description;
//       this.imageUrl = imageUrl;
//       this.userId = userId;
//    }

//    save() {
//       const db = getDb();
//       return db.collection('products').insertOne(this)
//          .then(result => {
//             //console.log(result);
//          })
//          .catch(err=> {
//             console.log(err)
//          })
//    }

//    update(prodId) {
//       const db = getDb();
//       // const newValues = { $set: {title: this.title, price: this.price, description: this.description, imageUrl: this.imageUrl}}
//       const newValues = {$set: this}; //si quiero reemplazar todos los valores puedo pasar el objeto completo
//       return db.collection('products').updateOne({_id: mongo.ObjectID(prodId)}, newValues)
//          .then(result => {
//             console.log(result);
//          })
//          .catch(err=> {
//             console.log(err)
//          })
//    }

//    static fetchAll() {
//       const db = getDb();
//       return db.collection('products')
//          .find()
//          .toArray()
//          .then(products => {
//             return products;
//          }).catch(err=>{
//             console.log(err);
//          });
//    }

//    static findById(prodId) {
//       const db = getDb();
//       return db.collection('products')
//          .find({_id: new mongo.ObjectID(prodId) })
//          .next()
//          .then(product => {
//             return product;
//          }).catch(err=>{
//             console.log(err);
//          });
//    }

//    static deleteById(prodId) {
//       const db = getDb();
//       return db.collection('products')
//          .deleteOne({_id: new mongo.ObjectID(prodId) })
//          .then(result => {
//             return result.deletedCount;
//          }).catch(err=>{
//             console.log(err);
//          });
//    }

// }

