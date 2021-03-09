const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const notFound = require('./controllers/notfound');

const dotenv = require('dotenv');
dotenv.config();

//modelos
const User = require('./models/user');

const app = express();

//motor de plantillas ejs
app.set('view engine', 'ejs');
app.set('views', 'views'); 

app.use(express.static(path.join(__dirname, 'public'))); //le indico la ruta al contenido estático 
app.use(bodyParser.urlencoded({extended: false})) //body-parser config

//RUTAS
app.use((req, res, next) =>{
   User.findById('60468a8832b5705238a0891e').then(user => {
      req.user = user;
      next();
   }).catch(err => {
      console.log(err);
   }) 
});

app.use('/admin',adminRoutes); //podemos filtrar por un prefijo las rutas
app.use(shopRoutes);
// //page not found
app.use(notFound.getNotFound);

const uriMongo = `mongodb+srv://juanan:${process.env.MONGO_PASSWORD}@cursonodemax.omdwl.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
mongoose.connect(uriMongo, {useUnifiedTopology: true, useNewUrlParser:true })
   .then(() =>{
      const userId = "60468a8832b5705238a0891e";
      User.findById(userId).then(user => {
         if (!user) {
            const newUser = new User({
               name:'juanan', 
               email:'juanan@testing.com', 
               password:'store-my-password', 
               cart: {
                  items:[]
               }
            });
            newUser.save()
         }
      })
      //server
      app.listen(3000);
   }).catch(err=>{
      console.log(err);
   })


