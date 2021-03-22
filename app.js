const express = require('express');
const bodyParser = require('body-parser');
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
app.use(bodyParser.urlencoded({ extended: false })); //body-parser config
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

//RUTAS
app.use((req, res, next) => {
	const user = req.session.user;
	if (!user) {
		return next();
	}
	User.findById(user._id)
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => {
			console.log(err);
		});
});

//middleware para añadir a cada página que renderizamos una información
app.use((req, res, next) => {
	res.locals.isAuth = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use('/admin', adminRoutes); //podemos filtrar por un prefijo las rutas
app.use(shopRoutes);
app.use(authRoutes);
app.use(notFound.getNotFound); // //page not found

mongoose
	.connect(URI_MONGO, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => {
		//después de lograr la conexión a la bd pongo en marcha el servidor
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
