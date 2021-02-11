const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');


router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/product-detail', shopController.getProductsDetails);
router.get('/cart', shopController.getCart);
router.get('/cart', shopController.getOrders);
router.get('/checkout', shopController.getCheckOut);

module.exports = router;