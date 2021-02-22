const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const notFound = require('./controllers/notfound');

const app = express();

//motor de plantillas ejs
app.set('view engine', 'ejs');
app.set('views', 'views'); 

app.use(express.static(path.join(__dirname, 'public'))); //le indico la ruta al contenido estático 
app.use(bodyParser.urlencoded({extended: false})) //body-parser config

//RUTAS
app.use((req, res, next) =>{
   User.findByPk(1).then(user => {
      req.user = user;
      next();
   }).catch(err => console.log(err));
})
app.use('/admin',adminRoutes); //podemos filtrar por un prefijo las rutas
app.use(shopRoutes);
//page not found
app.use(notFound.getNotFound);

//Módelos relaciones
User.hasMany(Product);
Product.belongsTo(User, {constraints: true,  onDelete: 'CASCADE'}); //definir claves ajenas
User.hasOne(Cart);
//esta sería opcional. es suficiente con indicar la relación en un único sentido
Cart.belongsTo(User, {constraints: true,  onDelete: 'CASCADE'}); 
//relación muchos a muchos a través de la entidad cart-item (CartItem)
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});


//sequelize.sync({force:true}) la opción force:true crea todas las tablas de nuevo, ojo se pierde toda la información de las tablas registros incluidos
sequelize.sync()
   .then( _ => {
      return User.findByPk(1);
   }).then(user=>{
      if(!user) {
         return User.create({name:'JuanAn', email: 'juanan@testing.com'})
      }
      return user;
   }).then(user => {
      user.getCart().then(cart => {
         if (!cart) return user.createCart();
         return cart;
      })
   }).then(_ => {
      app.listen(3000);
   }).catch(err => {
      console.log('ERROR: ' + err);
});

//server
//app.listen(3000);
