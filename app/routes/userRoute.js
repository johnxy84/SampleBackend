'use strict';
const Router = require('restify-router').Router;
const router = new Router();

module.exports = (serviceLocator, authMiddleWare) => {
	let userController = serviceLocator.get('userController');

	/**
	 * Get single User Detail
	 */
	router.get('/:id', authMiddleWare, (req, res, next) => {
		userController.getUser(req, res, next);
	});

	/**
	 * Gets all Users
	 */
	router.get('/', authMiddleWare, (req, res, next) => {
		userController.getUsers(req, res, next);
	});
	
	/**
	 * Updates a user
	 */
	router.put('/:id', authMiddleWare, (req, res, next) => {
		userController.updateUser(req, res, next);
	});

	/**
	 * Resets a user password
	 */
	router.post('/resetpassword/:id', authMiddleWare, (req, res, next) => {
		userController.resetPassword(req, res, next);
	});

	/**
	 * Delete a user's account
	 */
	router.del('/delete/:id', authMiddleWare, (req, res, next) => {
		userController.deleteUser(req, res, next);
    });
    
    return router;
}