const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/is-auth');
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/product-detail/:productId', shopController.getProductDetails);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.deleteItemCart);
router.get('/orders', isAuth, shopController.getOrders);
router.post('/create-order', isAuth, shopController.postOrder);
router.get('/checkout', isAuth, shopController.getCheckOut);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);
module.exports = router;
