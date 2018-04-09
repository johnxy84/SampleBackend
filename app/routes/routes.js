'use strict';
/**
 * Module Dependencies
 */
const errors = require('restify-errors');


const authController = require ('app/controllers/authController.js')

module.exports = function(server) {

	/**
	 * Create a User
	 */
	server.post('/auth/register', authController.register);

	/**
	 * Login user
	 */
	server.post('/auth/login', authController.login);

	server.get('/', (req, res, next)=>{ 
		res.send("Welcome to my sample API");
		next();
	});
};    