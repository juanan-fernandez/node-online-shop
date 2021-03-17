//librerias de terceros
const express = require('express');
const router = express.Router();
//imports propios
const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

router.get('/products', isAuth, adminController.getProducts);

module.exports = router;
