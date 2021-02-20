
const db = require('../util/database');
const Cart = require('./cart');



module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		if(!this.id) {
			return db.execute('insert into products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
							[this.title, this.price, this.imageUrl, this.description]
			);		
		} else{
			return db.execute("update products set title=?, price=?, imageUrl=?, description=? where idProduct=?",
						 [this.title, this.price, this.imageUrl, this.description, this.id]
			);
		}
	
	}

	static deleteById(id) {
		return db.execute("delete from products where idProduct=?", [id]);
	}

	static fetchAll() {
		return db.execute('select * from products');
	}

	static fetchProduct(id) {
		return db.execute("select * from products where idProduct=?", [id]);
	}
};
