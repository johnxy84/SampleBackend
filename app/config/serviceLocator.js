'use strict';

const serviceLocator =  require ('app/libs/service_locator.js');
const userService = require ('app/services/userService.js');
const config = require('app/config/config.js');

/**
 * Returns an instance of User Service
 */
serviceLocator.register('userService', () => {
    return userService;
});

/**
 * Returns an instance of our logger
 */
serviceLocator.register('logger', () =>{
    
    
    return require('app/libs/logger.js').create(config.loggerConfig);
})

serviceLocator.register('userController', (serviceLocator)=>{
    let logger = serviceLocator.get('logger');
    let UserService = require('app/services/UserService.js');
    return require('app/controllers/userController.js')(new UserService(logger));
})

serviceLocator.register('authController', (serviceLocator)=>{
    let logger = serviceLocator.get('logger');
    let AuthService = require('app/services/AuthService.js');
    return require('app/controllers/authController.js')(new AuthService(logger));
})

module.exports = serviceLocator;