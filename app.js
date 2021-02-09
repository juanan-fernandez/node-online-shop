const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//const expressHbs = require('express-handlebars'); para el motor de plantillas handlebars

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// app.engine('hbs', expressHbs({
//                               layoutsDir: 'views/layout/', 
//                               defaultLayout:'main-layout.hbs'
//                            })
//          ); declaración para handlebars

app.set('view engine', 'ejs');
//app.set('view engine', 'pug'); //para pug
app.set('views', 'views'); 

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public'))); //le indico la ruta al contenido estático 

app.use('/admin/',adminData.routes); //podemos filtrar por un prefijo las rutas
app.use(shopRoutes);

app.use((req, res, next) => {
   //res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
   //res.status(404).render('404',{pageTitle:'Not found from Hanlebars'});
   res.status(404).render('404',{pageTitle:'Not found from Ejs'});
})



app.listen(3000);
