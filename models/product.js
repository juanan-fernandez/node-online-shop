const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

const getProductsFromFile = (cb) => {	
	fs.readFile(p, (err, data) =>{
		if (err) {
			cb([])
		} else {
			cb(JSON.parse(data));
		}
	})
}

module.exports = class Product {
	constructor(title, imageUrl, description, price) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}
	
	save() {
		this.id = Date.now() + (Math.random()*100).toString(16).substr(3).toUpperCase();
		getProductsFromFile(products  => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), err =>{
				console.log(err);
			});
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
   }

	static fetchProduct(id, cb) { 
		getProductsFromFile(products => {
			if (products.length > 0) {
				const product = products.find( p => p.id === id);
				cb(product);
			}else {
				cb({});
			}	
		});
	}
};
