'use strict';
const helper = require('app/helpers/helper.js');
const constants = require('app/config/constants.js');
const jwt = require('jsonwebtoken');
const config = require('app/config/config.js');

const Router = require('restify-router').Router;
const router = new Router();

module.exports = function(server, serviceLocator) {

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
					res.tokenData = decodedToken
					next();
				}
			});
		}else{
			// if there is no token, return an error
			return helper.sendError(res, 400, 'No token provided');
		}
	}
	
	let userRoute = require('app/routes/userRoute.js')(serviceLocator, authMiddleWare);
	let authRoute = require('app/routes/authRoute.js')(serviceLocator);
	let productRoute = require('app/routes/productRoute.js')(serviceLocator, authMiddleWare);
	let categoryRoute = require('app/routes/categoryRoute.js')(serviceLocator, authMiddleWare);

	router.add('/categories', categoryRoute);
	router.add('/products', productRoute);
	router.add('/users', userRoute);
	router.add('/auth', authRoute);
	
	router.get('/v1', (req, res, next)=>{ 
		res.send(config.info);
		next();
	});

	router.applyRoutes(server);
};    