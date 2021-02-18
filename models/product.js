const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

const getProductsFromFile = (cb) => {
	fs.readFile(p, (err, data) => {
		if (err) {
			cb([]);
		} else {
			cb(JSON.parse(data));
		}
	});
};

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile((products) => {
			if (this.id) {
				const indexProduct = products.findIndex((p) => p.id === this.id);
				const updatedProducts = [...products];
				updatedProducts[indexProduct] = this;
				fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
					console.log(err);
				});
			} else {
				this.id = Date.now() + (Math.random() * 100).toString(16).substr(3).toUpperCase();
				products.push(this);
				fs.writeFile(p, JSON.stringify(products), (err) => {
					console.log(err);
				});
			}
		});
	}

	// static deleteById(id) {
	// 	getProductsFromFile(products => {
	// 		const indexDeleteProduct = products.findIndex(p => p.id === id);
	// 		if (indexDeleteProduct >= 0) {
	// 			const newProducts = [...products];
	// 			newProducts.splice(indexDeleteProduct, 1);
	// 			fs.writeFile(p, JSON.stringify(newProducts), err =>{
	// 				console.log(err);
	// 			});
	// 		}
	// 	})
	// }

	//otra forma más elegante de hacerlo
	static deleteById(id) {
		getProductsFromFile((products) => {
			const newProducts = products.filter((p) => p.id !== id);
			fs.writeFile(p, JSON.stringify(newProducts), (err) => {
				if (!err) {
					//borrar los productos con ese id del carrito puesto que se han borrado de la lista de productos disponibles.
					Cart.removeFromCart(id);
				} else {
					console.log(err);
				}
			});
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static fetchProduct(id, cb) {
		getProductsFromFile((products) => {
			if (products.length > 0) {
				const product = products.find((p) => p.id === id);
				cb(product);
			} else {
				cb({});
			}
		});
	}
};
