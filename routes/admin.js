//librerias de terceros
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

//imports propios
const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post(
	'/add-product',
	isAuth,
	[
		body('title', 'Please enter a title for the product.').trim().notEmpty().isString(),
		body('price', 'Please enter a valid price greater than 0, for the product')
			.trim()
			.isFloat()
			.custom((value, { req }) => {
				if (value <= 0) return false;
				return true;
			}),
		body('description', 'Please description for the product must be at least 10 characters')
			.trim()
			.isLength({ min: 5 }),
	],
	adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post(
	'/edit-product',
	isAuth,
	[
		body('title', 'Please enter a title for the product.').trim().notEmpty().isString(),
		body('price', 'Please enter a valid price greater than 0, for the product')
			.trim()
			.isFloat()
			.custom((value, { req }) => {
				if (value <= 0) return false;
				return true;
			}),
		body('description', 'Please description for the product must be at least 10 characters')
			.trim()
			.isLength({ min: 5 }),
	],
	adminController.postEditProduct
);

router.delete('/delete-product/:productId', isAuth, adminController.deleteProduct);

router.get('/products', isAuth, adminController.getProducts);

module.exports = router;
