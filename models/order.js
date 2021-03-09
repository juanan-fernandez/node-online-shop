const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
   products: [
      {
         productData: {type: Object, required: true}, //podriamos definir el documento Producto entero
         quantity: {type: Number, required: true }
      }
   ],
   user: {
      userId : {type: Schema.Types.ObjectId, ref: 'User', required: true},
      name: { type: String, required: true },
      email: { type: String, required: true }
   },
   //totalOrder: { type: Number, required: true}   
});

module.exports = mongoose.model('Order', orderSchema);