'use strict';
const Router = require('restify-router').Router;
const router = new Router();

module.exports = (serviceLocator, authMiddleWare) => {
	let categoryController 	= serviceLocator.get('categoryController');

	/**
	 * Get's a category by id
	 */
	router.get('/:id', authMiddleWare, (req, res, next) => {
		console.log("Getting one categories")
		categoryController.getCategoryById(req, res, next);
	});

	/**
	 *Gets all categories
	 */
	router.get('/', authMiddleWare, (req, res, next) => {
		console.log("Getting all categories")
		categoryController.getCategories(req, res, next);
	});
    return router;
}