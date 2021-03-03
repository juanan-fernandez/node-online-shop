const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const dotenv = require('dotenv');
dotenv.config();

let _db;

const mongoConnect = callback => {
	const uriMongo = `mongodb+srv://juanan:${process.env.MONGO_PASSWORD}@cursonodemax.omdwl.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
	MongoClient.connect(uriMongo, {useUnifiedTopology: true})
		.then(client => {
			console.log('Connected ok!');
			_db = client.db();
			callback();
		}).catch(err=>{
			console.log(err);
			throw err;
		});
}

const getDb = () =>{
	if(_db) {
		return _db;
	}
	throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

