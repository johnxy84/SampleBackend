'use strict';
const helper = require('app/helpers/helper.js');
const constants = require('app/config/constants.js');
const bcrypt = require ('bcrypt');

/**
 * Model Schema
 */
const User = require('app/models/user.js');

class UserService {

    constructor(logger){
    this.logger = logger;
    }

    generatePasswordForUser(userId, password){
        return new Promise ((resolve, reject)=>{
            generateHash(password)
            .then((hash)=>{
                this.logger.info("Updating password");
                User.findOneAndUpdate({ '_id': userId }, {password: hash}, (err, user) => {
                    if (err) {
                        reject(err);
                        return ;
                    }
                    if(user){
                        this.logger.info("Updated password")
                        resolve({
                            status: 'success',
                            message: 'Password updated succesfully'
                        })
                    }
                    else{
                        resolve({
                            status: 'error',
                            code: 404,
                            message: constants.USER_NOT_FOUND
                        })
                    }
                });
            })
            .catch((err)=>{
                reject(err);
                return ;
            }) 
        })
    }

    deleteUser(userId){
        return new Promise((resolve, reject)=>{
            User.findByIdAndRemove({ '_id': userId }, (err, user) => {
                if (err) {
                    this.logger.info ("Error deleteing user : " + err);
                    reject(err);
                    return;
                }
                if(user)
                {
                    this.logger.info("Deleted user")
                    resolve({
                        status: 'success',
                        message: `User '${userId}' deleted`
                    })
                }else{
                    this.logger.info ("User not found");
                    resolve({
                        status: 'error',
                        code: 400,
                        message: constants.USER_NOT_FOUND
                    })
                }
            });        
        })
    }

    getUserData(userId){
        return new Promise((resolve, reject)=>{
            User.findOne({ '_id': userId }, 'firstname lastname email', (err, user) => {
                if (err) {
                    reject(err);
                    return; 
                }
                if(user){
                    resolve({
                        status: 'success',
                        user: helper.parseUser(user)
                    })
                } else{
                    resolve({
                        status: 'error',
                        code: 404,
                        message: constants.USER_NOT_FOUND
                    })
                }
                });
        });
    }

    getAllUsers(){
        return new Promise((resolve, reject)=>{
            User.find({}, 'firstname lastname email',  (err, users) => {
                if (err) {
                    reject(err);
                    return; 
                }
                if(users){
                    var userData = [];
                    users.forEach(element => {
                        userData.push(helper.parseUser(element));
                    });
                    resolve({
                        status: 'success',
                        data: userData
                    });
                }
                else{
                    resolve({
                        status: 'success',
                        data: []
                    });
                }
            });
        })
    }

    updateUser(userId, updateData){
        return new Promise((resolve, reject)=>{
            User.findOneAndUpdate({ '_id': userId }, updateData, { "new": true},  (err, user) => {
                if (err) {
                    this.logger.info ("Error updating User : " + err);
                    reject(err);
                    return; 
                }
                if(user){
                    this.logger.info("Updated user with payload: " + JSON.stringify(updateData))
                    resolve({
                        status: 'success',
                        message: helper.parseUser(user)
                    });
                }
                else{
                    resolve({
                        status: 'error',
                        code: 404,
                        message: constants.USER_NOT_FOUND
                    });
                }
            });
        });  
    }
}

function generateHash (password) {
    return new Promise ((resolve, reject)=>{
    bcrypt.hash(password, 10, function (err, hash){
        if (err) {
            reject(err);
        }
        resolve(hash);
      })
    })
};

module.exports = UserService;