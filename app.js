const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const notFound = require('./controllers/notfound');

const app = express();

//motor de plantillas ejs
app.set('view engine', 'ejs');
app.set('views', 'views'); 
app.use(express.static(path.join(__dirname, 'public'))); //le indico la ruta al contenido estático 
app.use(bodyParser.urlencoded({extended:false}))

app.use('/admin',adminRoutes); //podemos filtrar por un prefijo las rutas
app.use(shopRoutes);
//page not found
app.use(notFound.getNotFound);

//server
app.listen(3000);
