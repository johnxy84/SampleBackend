'use strict';
const helper = require('app/helpers/helper.js');
const constants = require('app/config/constants.js');

class categoryController {

    constructor (categoryService){
        this.categoryService = categoryService;
    }

    getCategoryById(req, res, next) {
        let id = req.params.id || '';
        if (id === ''){
            helper.sendError(res, 400, constants.CATEGORY_NOT_FOUND);
            return next();
        }

        //check if it's a valid ID before using it, RegExing it against mongoose ObjectId property
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            //Invalid object return Bad Request
            return helper.sendError(res, 400, constants.CATEGORY_NOT_FOUND);
        }
        this.categoryService.getCategory(id).
        then((result)=>{
            if(result.status === 'error')
                helper.sendError(res, result.code, result.message);
            else
                helper.sendSuccess(res, result.category);
        }).
        catch((err)=>{
            helper.sendError(res, 500, err.toString());
        });
        next()
    }
    
    getCategories(req, res, next){
        this.categoryService.getAllCategories().
        then((result)=>{
            if (result.status === 'error')
                helper.sendError(res, result.code, result.message)
            else
                helper.sendSuccess(res, result.categories);
        }).
        catch((err)=>{
            helper.sendError(res, 500, err.toString());
        })
        next();
    }

}

module.exports = (logger, categoryService) => new categoryController(logger, categoryService);