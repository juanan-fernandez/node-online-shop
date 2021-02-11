//librerias de terceros
const express = require('express');
//imports propios
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);
router.posat('/delete-product', adminController.postDeleteProduct);

router.get('/products', adminController.getProducts);

module.exports = router;

