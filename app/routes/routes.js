'use strict';
const helper = require('app/helpers/helper.js');
const constants = require('app/config/constants.js');
const jwt = require('jsonwebtoken');
const config = require('app/config/config.js');

module.exports = function(server, serviceLocator) {

	let authController = serviceLocator.get('authController');
	let userController = serviceLocator.get('userController');


	let authMiddleWare = (req, res, next)=>{
		if (req.method !== 'GET' && !req.is('application/json')) {
			return res.send(400, { 
				status: "error", 
				message: "Request wasn't json." 
			});
		}
	
		var token = req.params.token || req.query.token || req.headers['x-access-token'];
		// decode and authorize token
		if(token){
			// verifies secret and checks exp
			jwt.verify(token, config.secretKey, function(err, decodedToken) {      
				if (err) {
					return helper.sendError(res, 400, "Couldn't authenticate token"); 
				} else {
					// if everything is good, save to request for use in other routes
					res.token = decodedToken
					next();
				}
			});
		}else{
			// if there is no token, return an error
			return helper.sendError(res, 400, 'No token provided');
		}
	}
	/**
	 * Create a User
	 */
	server.post('/auth/register', (req, res, next) => {
		authController.register(req, res, next)
	});

	/**
	 * Login user
	 */
	server.post('/auth/login', (req, res, next) => {
		authController.login(req, res, next);
	});

	/**
	 * Get single User Detail
	 */
	server.get('/users/:id', authMiddleWare, (req, res, next) => {
		userController.getUser(req, res, next);
	});

	/**
	 * Gets all Users
	 */
	server.get('/users', authMiddleWare, (req, res, next) => {
		userController.getUsers(req, res, next);
	});
	
	/**
	 * Updates a user
	 */
	server.put('/users/:id', authMiddleWare, (req, res, next) => {
		userController.updateUser(req, res, next);
	});

	/**
	 * Resets a user password
	 */
	server.post('/user/resetpassword/:id', authMiddleWare, (req, res, next) => {
		userController.resetPassword(req, res, next);
	});

	/**
	 * Delete a user's account
	 */
	server.del('/users/delete:id', authMiddleWare, (req, res, next) => {
		userController.deleteUser(req, res, next);
	});

	server.get('/v1', (req, res, next)=>{ 
		res.send(config.info);
		next();
	});
};    