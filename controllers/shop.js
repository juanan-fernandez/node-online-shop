const fs = require('fs');
const path = require('path');
const pdfDoc = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');
const { RSA_NO_PADDING } = require('constants');

exports.getIndex = (req, res) => {
	Product.find()
		.then(products => {
			//console.log(req.session.isLoggedIn);
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Products List',
				path: '/products',
			}); //usamos motor de plantillas
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getCart = (req, res) => {
	console.log(req.session.user);
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(userCart => {
			console.log(userCart.cart.items);
			const cartInfo = { products: [...userCart.cart.items], totalCart: 0 };
			res.render('shop/cart', {
				pageTitle: 'Cart Items',
				path: '/cart',
				cart: cartInfo,
			});
		})
		.catch(err => {
			console.log('error:' + err);
		});
};

exports.postCart = (req, res) => {
	const prodId = req.body.productId;

	Product.findById(prodId)
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(_ => {
			res.redirect('/cart');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.deleteItemCart = (req, res) => {
	const prodId = req.body.productId;
	req.user
		.deleteItemCart(prodId)
		.then(_ => {
			res.redirect('/cart');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getOrders = (req, res) => {
	Order.find({ 'user.userId': req.user._id })
		.then(orders => {
			res.render('shop/orders', {
				pageTitle: 'Pedidos',
				path: '/orders',
				orders: orders,
			});
		})
		.catch(err => console.log(err));
};

exports.postOrder = (req, res) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(userCart => {
			const products = userCart.cart.items.map(p => {
				return { productData: { ...p.productId }, quantity: p.quantity };
			});

			const order = new Order({
				products: products,
				user: { userId: userCart._id, name: userCart.name, email: userCart.email },
			});
			return order.save();
			//return order;
		})
		.then(result => {
			console.log('Order created:', result);
			//remove items from cart
			return req.user.clearCart();
		})
		.then(result => {
			console.log('Cart cleaned:', result);
			res.redirect('/orders');
		})
		.catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
	Product.find().then(products => {
		res.render('shop/product-list', {
			prods: products,
			pageTitle: 'Products List',
			path: '/products',
		});
	});
};

exports.getProductDetails = (req, res) => {
	const prodId = req.params.productId;
	Product.findById(prodId).then(product => {
		res.render('shop/product-detail', {
			pageTitle: product.title,
			path: '/products',
			product: product,
		});
	});
};

exports.getCheckOut = (req, res) => {
	res.render('shop/checkout', { pageTitle: 'Products detail', path: '/products' });
};

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.findById(orderId)
		.then(order => {
			if (!order) {
				return next(new Error('Error retrieving invoice. Order not found.'));
			}
			if (order.user.userId.toString() !== req.user._id.toString()) {
				return next(new Error('Access not allowed'));
			}
			const pdfName = orderId + '-invoice.pdf';
			const invoiceFileName = path.join('data', 'invoices', pdfName);
			//con los datos del pedido crearemos una factura
			let totalInvoice = 0;
			let totalItem = 0;
			res.setHeader('Content-Type', 'application-pdf');
			res.setHeader('Content-Disposition', 'attachment; filename="' + pdfName + '"');

			const pdfInvoice = new pdfDoc();
			pdfInvoice.pipe(fs.createWriteStream(invoiceFileName));
			pdfInvoice.pipe(res);

			pdfInvoice.fontSize(20).text('Invoice', { underline: true });
			pdfInvoice.text('---------------------------------------');
			order.products.forEach(prod => {
				totalItem = prod.quantity * prod.productData.price;
				totalInvoice = totalInvoice + totalItem;
				pdfInvoice
					.fontSize(14)
					.text(`${prod.productData.title} ----- ${prod.quantity} X  $${prod.productData.price} = $${totalItem}`);
			});

			pdfInvoice.fontSize(20).text(`Total Invoice: ${totalInvoice}`);
			pdfInvoice.end();
			//leer el fichero en memoria antes de enviarlo como respuesta no es una buena opción si
			//los ficheros son grandes o si se generan muchas peticiones. podemos echar el servidor abajo
			// fs.readFile(invoiceFileName, (err, data) => {
			// 	if (err) {
			// 		return next(err);
			// 	}
			// 	res.setHeader('Content-Type', 'application-pdf');
			// 	res.setHeader('Content-Disposition', 'attachment; filename="' + pdfName + '"');
			// 	res.send(data);
			// });
			//la manera más efectiva es realizar un streaming del fichero.
			// const file = fs.createReadStream(invoiceFileName);
			// res.setHeader('Content-Type', 'application-pdf');
			// res.setHeader('Content-Disposition', 'attachment; filename="' + pdfName + '"');
			// file.pipe(res);
		})
		.catch(err => next(err));
};
