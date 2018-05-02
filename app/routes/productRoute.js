'use strict';
const Router = require('restify-router').Router;
const router = new Router();

module.exports = (serviceLocator, authMiddleWare) => {
	let productController	= serviceLocator.get('productController')

	/**
	 * Create a Product
	 */
	router.post('/', authMiddleWare, (req, res, next) => {
		productController.saveProduct(req, res, next)
	});

	/**
	 * Gets all Products
	 */
	router.get('/', authMiddleWare, (req, res, next) => {
		productController.getProducts(req, res, next)
	});

	/**
	 * Gets Product  by Id
	 */
	router.get('/:id', authMiddleWare, (req, res, next) => {
		productController.getProductById(req, res, next)
	});
	
	/**
	 * Search for Products
	 */
	router.get('/search/:query', authMiddleWare, (req, res, next) => {
		productController.searchProducts(req, res, next)
	});
	
	
    return router;
}