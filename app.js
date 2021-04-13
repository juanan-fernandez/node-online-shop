const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const notFound = require('./controllers/notfound');

const dotenv = require('dotenv');
dotenv.config();

//modelos
const User = require('./models/user');

const app = express(); //iniciar express

//conexion bd
const URI_MONGO = `mongodb+srv://juanan:${process.env.MONGO_PASSWORD}@cursonodemax.omdwl.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

//store sessions
const store = new MongoDBStore({
	uri: URI_MONGO,
	collection: 'my-seassons',
});

store.on('error', function (error) {
	console.log(error);
});

//protección ataques csrf video 259. Más info: https://github.com/expressjs/csurf
const csrfProtection = csurf();

//motor de plantillas ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public'))); //le indico la ruta al contenido estático
app.use(express.urlencoded({ extended: false })); //body-parser config
app.use(
	session({
		secret: 'thePianoHasbeenDrinking',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use(csrfProtection); //OJO! siempre inicializar después del objeto session.
app.use(flash()); //OJO! connect-flash siempre iniciar después de haber conigurado la sesión.

//middleware para añadir a cada página que renderizamos una información
app.use((req, res, next) => {
	res.locals.isAuth = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

//RUTAS
app.use((req, res, next) => {
	const user = req.session.user;
	if (!user) {
		return next();
	}
	User.findById(user._id)
		.then(user => {
			if (!user) return next();
			req.user = user;
			next();
		})
		.catch(err => {
			next(new Error(err));
		});
});

app.use('/admin', adminRoutes); //podemos filtrar por un prefijo las rutas
app.use(shopRoutes);
app.use(authRoutes);
app.use('/500', notFound.getServerError); // //page server error
app.use(notFound.getNotFound); // //page not found

//middleware error handling. Maneja los errores de toda la página
app.use((error, req, res, next) => {
	//podriamos hacer log del error en un fichero de texto,
	//redirigir a una página para mostrar más información del error,
	//enviar un e-mail al administrador, etc...
	res.redirect('/500'); //mensje para el usuario
});

mongoose
	.connect(URI_MONGO, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => {
		//después de lograr la conexión a la bd pongo en marcha el servidor
		app.listen(3000);
	})
	.catch(err => {
		next(new Error(err));
	});
