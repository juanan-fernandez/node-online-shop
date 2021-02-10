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
	constructor(title) {
		this.title = title;
	}
	
	save() {
		getProductsFromFile(products  => {
			products.push(this);
			console.log(products);
			fs.writeFile(p, JSON.stringify(products), err =>{
				console.log(err);
			});
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
   }
};
