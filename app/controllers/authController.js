const helper = require ('app/helpers/helper.js');
const Joi = require ('Joi');
const validator = require('app/models/validator.js');
const bcrypt = require('bcrypt');

/**
 * Model Schema
 */
const User = require('app/models/user.js');

let authController = {
    register: (req,res,next) => {
            if (!req.is('application/json')) {
                helper.sendError(res, 400, "Expects 'application/json'");
                return next();
        }
        else{
            let data = req.body || {};

            const err = Joi.validate(data, validator.registerValidationSchema).error;
            //check if it passed validation
            if(err){
                helper.sendError(res, 400, err);
                return next();
            }
            console.log("Passed validation tests");
            
            //check if user with email already exists
            var user = User.findOne({email: data.email})
            if (!user)
            {
                console.log(JSON.stringify(user));
                helper.sendError(res, 400, `Email: ${data.email} already exist`)
                return next();
            }

            user = new User(data);
            console.log("Creating New User");
            user.save(function(err) {
                if (err) {
                    console.log("Couldn't save user: " + err);
                    helper.sendError(res, 500, err);
                }
                else{
                    console.log("User saved succesfully");
                    var token = user.generateToken();
                    //logged in
                    var data = {
                        token:  token,
                        data : user.value
                    }
                    helper.sendSuccess(res, data);
                }
            });
            
            return next();
        }
    },

    login: (req, res, next) => {
        console.log("login fired");
        let data = req.body || {};

        const err = Joi.validate(data, validator.loginValidationSchema).error;
        //check if it passed validation
        if(err){
            helper.sendError(res, 400, err);
            return next();
        }
        console.log("Passed validation tests");
        
        User.findOne({ email: data.email }, function(err, user) {
			if (err) {
                helper.sendError(res,404, "User with that email doesn't exist");
                return next();
            }
            if (user.isValidPassword){
                var token = user.generateToken();
                //logged in
                var data = {
                    token:  token,
                    data : user
                }
                helper.sendSuccess(res, data);
            }
            else{
                //invalid password
                helper.sendError(res, 201, "Invalid Password");
            }
			next();
		});
    },
}


module.exports = authController;