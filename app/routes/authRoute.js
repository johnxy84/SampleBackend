'use strict';
const Router = require('restify-router').Router;
const router = new Router();

module.exports = (serviceLocator) => {
	let authController = serviceLocator.get('authController');

	/**
	 * Create a User
	 */
	router.post('/register', (req, res, next) => {
		authController.register(req, res, next)
	});

	/**
	 * Login user
	 */
	router.post('/login', (req, res, next) => {
		authController.login(req, res, next);
	});
    
    return router;
}