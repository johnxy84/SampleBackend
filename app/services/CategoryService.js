'use strict';
const helper = require('app/helpers/helper.js');
const constants = require('app/config/constants.js');

/**
 * Category Schema
 */
const Category = require('app/models/category.js');

class CategoryService {

    constructor(logger){
        this.logger = logger;
    }

    getCategory(categoryId){
        return new Promise((resolve, reject)=>{
            Category.findOne({ '_id': categoryId }, 'name', (err, category) => {
                if (err) {
                    reject(err);
                    return; 
                }
                if(category){
                    resolve({
                        status: 'success',
                        category: category
                    })
                }
                else{
                    resolve({
                        status: 'error',
                        code: 404,
                        message: constants.CATEGORY_NOT_FOUND
                    })
                }
                });
        });
    }

    getAllCategories(){
        return new Promise((resolve, reject)=>{
            Category.find({}, 'name',  (err, categories) => {
                if (err) {
                    reject(err);
                    return; 
                }
                if(categories){
                    resolve({
                        status: 'success',
                        categories: categories
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
}

module.exports = CategoryService;