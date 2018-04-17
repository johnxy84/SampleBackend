'use strict';
const helper = require('app/helpers/helper.js');
const constants = require('app/config/constants.js');
const config = require('app/config/config.js');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

/**
 * User Model Schema
 */
const User = require('app/models/user.js');

class AuthService {

    constructor(logger)
    {
        this.logger = logger;
    }

    loginUser(email, password){
        return new Promise ((resolve, reject)=>{
            User.findOne({ email: email }, (err, user) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!user){
                    resolve({
                        status: 'error',
                        code: 400,
                        message: constants.USER_NOT_FOUND
                    });
                    return;
                }
    
                //validate account password
                this.isValidPassword(password, user.password).
                then((value)=>{
                    if (value === true){
                        var token = this.generateToken(user);
                        //logged in
                        var userData = {
                            token:  token,
                            data : helper.parseUser(user)
                        }
                        resolve({
                            status: 'success',
                            data: userData
                        });
                    }
                    else{
                        //invalid password
                        resolve({
                            status: 'error',
                            code: 201,
                            message: constants.INVALID_PASSWORD
                        });
                    }
                }).
                catch((err)=>{
                    this.logger.info("Reject error" + err);
                    reject(err);
                });
            });
        })
    }

    registerNewUser(userData){
        return new Promise((resolve, reject)=>{
           //check if user with email already exists
            User.findOne({email: userData.email}, (err, user)=>{
                if (err){
                    helper.sendError(res, 500, constants.SERVER_ERROR);
                    reject (err);
                    return;
                }
                //user already exist
                if(user)
                {
                    resolve({
                        status: 'error',
                        code: 400,
                        message: `Email: ${userData.email} already exist`
                    });
                    return;
                }

                //Doesn't exist, create a new user
                user = new User(userData);
                this.logger.info("Creating New User");
                user.save((err, doc) => {
                    if (err) {
                        this.logger.info("Couldn't save user: " + err);
                        reject(err);
                    }else{
                        this.logger.info("User saved succesfully");
                        var token = this.generateToken(doc);
                        //logged in
                        var data = {
                            token:  token,
                            data : helper.parseUser(doc)
                        }
                        resolve({
                            status: 'success',
                            data: data
                        });
                    }
                });
            })
        })
    }

    generateToken(user){
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        return jwt.sign({
            _id: user._id,
            email: user.email,
            name: user.name,
            exp: parseInt(expiry.getTime() / 1000),
            }, config.secretKey);  
    }
    
    isValidPassword (password, userPassword) {
        return new Promise ((resolve, reject)=>{
            bcrypt.compare(password, userPassword, function (err, result) {
                if(err){
                    //there was an error authenticating
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    };
    
}

module.exports = AuthService;