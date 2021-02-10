//node core
const path = require('path');
//librerias de terceros
const express = require('express');
//imports propios
const productsController = require('../controllers/products');

const router = express.Router();

router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

module.exports = router;

