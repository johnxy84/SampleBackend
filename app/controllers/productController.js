'use strict';
const helper = require('app/helpers/helper.js');
const Joi = require ('Joi');
const validator = require('app/models/validator.js');
const constants = require('app/config/constants.js');

class categoryController {

    constructor (productService){
        this.productService = productService;
    }

    saveProduct(req,res,next){
        let data = req.body || {};

        const err = Joi.validate(data, validator.productValidationSchema).error;
        //check if it passed validation
        if(err){
            helper.sendError(res, 400, err.toString());
            return next();
        }

        //register product using productService
        this.productService.saveProduct(data, res.tokenData._id)
        .then(result => {
            if(result.status === 'error'){
                helper.sendError(res, result.code, result.message);
            }else{
                helper.sendSuccess(res, result.product);
            }
        })
        .catch(err => {
            helper.sendError(res, 500, err.toString());
        })
        next();
    }

    updateProductById(req, res, next){
        let id = req.params.id || '';
        let data = req.body || {};

        if (id === ''){
            helper.sendError(res, 400, constants.INVALID_ID);
            return next();
        }

        //check if it's a valid ID before using it, RegExing it against mongoose ObjectId property
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            //Invalid object return Bad Request
            return helper.sendError(res, 400, constants.INVALID_ID);
        }

        //call userservice to update User
        this.productService.updateProduct(id, res.tokenData._id, data)
        .then((result)=>{
            if(result.status === 'error'){
                helper.sendError(res, result.code, result.message);
            }else{
                helper.sendSuccess(res, result.message);
            }
        })
        .catch((err)=>{
            helper.sendError(res, 500, err.toString());
        });

        next();
    }

    getProducts(req, res, next){
        this.productService.getProducts()
        .then((result)=>{
            if (result.status === 'error')
                helper.sendError(res, result.code, result.message)
            else
                helper.sendSuccess(res, result.products);
        })
        .catch((err)=>{
            helper.sendError(res, 500, err.toString());
        })
        next();
    }

    getProductsByUserId(req, res, next){
        let id = req.params.id || '';

        if (id === ''){
            helper.sendError(res, 400, constants.INVALID_ID);
            return next();
        }

        //check if it's a valid ID before using it, RegExing it against mongoose ObjectId property
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            //Invalid object return Bad Request
            return helper.sendError(res, 400, constants.INVALID_ID);
        }

        this.productService.getProductsByUserId(id)
        .then((result)=>{
            helper.sendSuccess(res, result.products);
        })
        .catch((err)=>{
            helper.sendError(res, 500, err.toString());
        })
        next();
    }

    searchProducts(req, res, next){
        let query = req.params.query || '';

        if (query === ''){
            helper.sendError(res, 400, constants.INAVLID_SEARCH_PARAMS);
            return next();
        }

        this.productService.searchForProducts(query)
        .then((result)=>{
            helper.sendSuccess(res, result.products);
        })
        .catch((err)=>{
            helper.sendError(res, 500, err.toString());
        })
        next();
    }

    getProductById(req, res, next){
        let id = req.params.id || '';

        if (id === ''){
            helper.sendError(res, 400, constants.INVALID_ID);
            return next();
        }

        //check if it's a valid ID before using it, RegExing it against mongoose ObjectId property
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            //Invalid object return Bad Request
            return helper.sendError(res, 400, constants.INVALID_ID);
        }

        this.productService.getProductById(id)
        .then((result)=>{
            if (result.status === 'error')
                helper.sendError(res, result.code, result.message)
            else
                helper.sendSuccess(res, result.products);
        })
        .catch((err)=>{
            helper.sendError(res, 500, err.toString());
        })
        next();
    }
}

module.exports = (logger, productService) => new categoryController(logger, productService);