'use strict';
const helper = require('app/helpers/helper.js');
const constants = require('app/config/constants.js');

/**
 * Model Schema
 */
const Product = require('app/models/product.js');

class ProductService {

    constructor(logger, categoryService){
        this.logger = logger;
        this.categoryService = categoryService;
    }

    getProducts(){
        return new Promise((resolve, reject)=>{
            Product.find({}, '_id title description categoryname ownerid createdAt updatedAt' ,  (err, products) => {
                if (err) {
                    reject(err);
                    return; 
                }
                if(products){
                    resolve({
                        status: 'success',
                        products: products
                    });
                }
                else{
                    resolve({
                        status: 'success',
                        products: []
                    });
                }
            });
        });
    }

    getProductById(productId){
        return new Promise((resolve, reject)=>{
            Product.findOne({'_id' : productId}, '_id title description categoryname ownerid createdAt updatedAt' ,  (err, products) => {
                if (err) {
                    reject(err);
                    return; 
                }
                if(products){
                    resolve({
                        status: 'success',
                        products: products
                    });
                }
                else{
                    resolve({
                        status: 'error',
                        code: 404,
                        message: constants.PRODUCT_NOT_FOUND
                    });
                }
            });
        })
    }

    getProductsByUserId(userId){
        return new Promise((resolve, reject)=>{
            Product.find({'ownerid' : userId}, '_id title description categoryname ownerid createdAt updatedAt' ,  (err, products) => {
                if (err) {
                    this.logger.info("There was an error finding the user's products");
                    reject(err);
                    return; 
                }
                resolve({
                    products
                });
            });
        })
    }

    searchForProducts(query){
        return new Promise((resolve, reject)=>{
            console.log(`Search Quesry ${query}`);
            Product.search(query, '_id title description categoryname ownerid createdAt updatedAt' ,  (err, products) => {
                if (err) {
                    reject(err);
                    return; 
                }
                if(products){
                    resolve({
                        status: 'success',
                        products: products
                    });
                }
                else{
                    resolve({
                        status: 'success',
                        products: []
                    });
                }
            });
        });
    }

    updateProduct(productId, userId, productData){
        //TODO: check if the user trying to edit the product is the owner of the product
        return new Promise((resolve, reject)=>{
            Product.findOneAndUpdate({ '_id': productId }, productData, { "new": true},  (err, product) => {
                if (err) {
                    this.logger.info ("Error updating Product : " + err);
                    reject(err);
                    return; 
                }
                if(user){
                    this.logger.info("Updated product with payload: " + JSON.stringify(updateData))
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
    
    saveProduct(productData, userId){
        return new Promise((resolve, reject)=>{
            //Check if the product category exists
            this.categoryService.getCategory(productData.categoryid)
            .then(result => {
                if(result.status !== 'success')
                {
                    reject(result.message)
                    return ;
                }

                productData.categoryId = result.category._id;
                productData.categoryname = result.category.name
                productData.ownerid = userId;
                var product = new Product(productData);

                product.save((err, doc) => {
                    if (err) {
                        this.logger.error("Couldn't Save product: " + err);
                        reject(err);
                    }else{
                        this.logger.info("Product saved succesfully");
                        resolve({
                            status: 'success',
                            product: helper.parseProduct(doc)
                        });
                    }
                });
            })
            .catch(err => {
                reject(err);
            })
        });  
    }
}

module.exports = ProductService;