const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

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

// const MONGO_SESSIONS = `mongodb://juanan:${process.env.MONGO_PASSWORD}@cursonodemax-shard-00-00.omdwl.mongodb.net:27017,cursonodemax-shard-00-01.omdwl.mongodb.net:27017,cursonodemax-shard-00-02.omdwl.mongodb.net:27017/${process.env.MONGO_DATABASE}?ssl=true`;

const store = new MongoDBStore({
	uri: URI_MONGO,
	collection: 'my-seassons',
});

store.on('error', function (error) {
	console.log(error);
});

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
