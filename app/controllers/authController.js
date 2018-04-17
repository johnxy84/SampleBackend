'use strict';

const helper = require ('app/helpers/helper.js');
const Joi = require ('Joi');
const validator = require('app/models/validator.js');
const constants = require('app/config/constants.js');

class authController {
    constructor( authService){
        this.authService = authService;
    }
    register(req,res,next){
            let data = req.body || {};

            const err = Joi.validate(data, validator.registerValidationSchema).error;
            //check if it passed validation
            if(err){
                helper.sendError(res, 400, err.toString());
                return next();
            }

            //register user using authService
            this.authService.registerNewUser(data).
            then(result => {
                if(result.status === 'error'){
                    helper.sendError(res, result.code, result.message);
                }else{
                    helper.sendSuccess(res, result.data);
                }
            }).
            catch(err => {
                helper.sendError(res, 500, err.toString());
            })
            next();
    }

    login(req, res, next){
        var data = req.body || {};

        const err = Joi.validate(data, validator.loginValidationSchema).error;
        //check if it passed validation
        if(err){
            helper.sendError(res, 400, err);
            return next();
        }
        //athenticate user using authServcice
        this.authService.loginUser(data.email, data.password)
        .then(result => {
            if(result.status === 'error'){
                helper.sendError(res, result.code, result.message);
            }else{
                helper.sendSuccess(res, result.data);
            }
        })
        .catch(err => {
            helper.sendError(res, 500, err.toString());
        });
        next();
    }
}

module.exports = (authService) => new authController(authService);