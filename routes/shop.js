const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/product-detail/:productId', shopController.getProductDetails);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item', shopController.deleteItemCart);
router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.postOrder);
router.get('/checkout', shopController.getCheckOut);

module.exports = router;
