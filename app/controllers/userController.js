'use strict';
const helper = require('app/helpers/helper.js');
const constants = require('app/config/constants.js');
const Joi = require ('Joi');
const validator = require('app/models/validator.js');

class userController {

    constructor (userService, productService){
        this.userService = userService;
        this.productService = productService;
    }

    getUser(req, res, next) {
        let id = req.params.id || '';
        if (id === ''){
            helper.sendError(res, 400, constants.INVALID_ID);
            return next();
        }

        //check if it's a valid ID before using it, RegExing it against mongoose ObjectId property
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            //Invalid object return BAd Request
            return helper.sendError(res, 400, constants.INVALID_ID);
        }
        this.userService.getUserData(id).
        then((result)=>{
            if(result.status === 'error')
            {
                helper.sendError(res, result.code, result.message);
            } else {
                //get user's Products

                this.productService.getProductsByUserId(id)
                .then(productsData => {
                    result.user.products = productsData.products;
                    helper.sendSuccess(res, result.user);
                })
                .catch(err => {
                    helper.sendError(res, 500, err.toString());
                })
            }
        })
        .catch((err)=>{
            helper.sendError(res, 500, err.toString());
        });
        next();
    }
    
    updateUser (req, res, next){
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
        this.userService.updateUser(id, data).
        then((result)=>{
            if(result.status === 'error'){
                helper.sendError(res, result.code, result.message);
            }else{
                helper.sendSuccess(res, result.message);
            }
        }).
        catch((err)=>{
            helper.sendError(res, 500, err.toString());
        });

        next();
    }
    
    deleteUser(req, res, next){
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

        //call service to delete user
        this.userService.deleteUser(id)
        .then(result=>{
            if(result.status === 'error'){
                helper.sendError(res, result.code, result.message);
            }else{
                helper.sendSuccess(res, result.message);
            }
        })
        .catch(err=>{
            helper.sendError(res, 500, err.toString());
        })
        next();
    }
    
    getUsers(req, res, next){
        this.userService.getAllUsers().
        then((result)=>{
            helper.sendSuccess(res, result.data);
        }).
        catch((err)=>{
            helper.sendError(res, 500, err.toString());
        })
        next();
    }

    resetPassword(req, res, next){
        let id = req.params.id || '';
        let data = req.body || {};

        if (id === ''){
            helper.sendError(res, 400, constants.INVALID_ID);
            return next();
        }

        const err = Joi.validate(data, validator.passwordValidator).error;
        //check if it passed validation
        if(err){
            helper.sendError(res, 400, err.toString());
            return next();
        }
        
        //check if it's a valid ID before using it, RegExing it against mongoose ObjectId property
        if (!id.match()) {
            //Invalid object return Bad Request
            helper.sendError(res, 400, constants.INVALID_ID);
            return next();
        }
        //generate new password hash
        this.userService.generatePasswordForUser(id, data.password)
        .then(result => {
            if(result.status === 'error'){
                helper.sendError(res, result.code, result.message);
            }else{
                helper.sendSuccess(res, result.message);
            }
        })
        .catch(err => {
            helper.sendError(res, 500, err.toString());
        })
        next();
    }

}

module.exports = (logger, userService) => new userController(logger, userService);