'use strict';

const serviceLocator =  require ('app/libs/service_locator.js');
const config = require('app/config/config.js');

/**
 * This class registers all our dependencies
 * we would be using throughout our application
 */

serviceLocator.register('logger', () =>{
    return require('app/libs/logger.js').create(config.loggerConfig);
})

serviceLocator.register('categoryService', () =>{
    let logger = serviceLocator.get('logger');
    let CategoryService = require('app/services/CategoryService.js');
    return new CategoryService(logger);
})

serviceLocator.register('productService', () =>{
    let logger = serviceLocator.get('logger');
    let ProductService = require('app/services/ProductService.js');
    let categoryService = serviceLocator.get('categoryService');;
    return new ProductService(logger, categoryService);
})

serviceLocator.register('userService', () =>{
    let logger = serviceLocator.get('logger');
    let UserService = require('app/services/UserService.js');
    return new UserService(logger);
})

serviceLocator.register('userController', (serviceLocator)=>{
    let logger = serviceLocator.get('logger');
    let userService = serviceLocator.get('userService');
    let productService =  serviceLocator.get('productService');
    return require('app/controllers/userController.js')(userService, productService);
})

serviceLocator.register('authController', (serviceLocator)=>{
    let logger = serviceLocator.get('logger');
    let AuthService = require('app/services/AuthService.js');
    return require('app/controllers/authController.js')(new AuthService(logger));
})

serviceLocator.register('categoryController', (serviceLocator)=>{
    let categoryService = serviceLocator.get('categoryService');;
    return require('app/controllers/categoryController.js')(categoryService);
})

serviceLocator.register('productController', (serviceLocator)=>{
    let productService = serviceLocator.get('productService');
    return require('app/controllers/productController.js')(productService);
})

module.exports = serviceLocator;