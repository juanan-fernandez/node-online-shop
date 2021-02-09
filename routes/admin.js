//node core
const path = require('path');
//librerias de terceros
const express = require('express');
//imports propios
const rootDir = require('../util/path');
const { render } = require('ejs');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
	//res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>')
	//res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
	res.render('add-product', {
			pageTitle:'Add Prod', 
			path:'/admin/add-product',
			formsCSS: true
	});
});

router.post('/add-product', (req, res, next) => {
	products.push({ title: req.body.title });
	res.redirect('/');
});

exports.routes = router;
exports.products = products;
