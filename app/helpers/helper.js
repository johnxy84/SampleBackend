'use strict';
const constants = require ('app/config/constants.js');

let helper = {
    
    sendSuccess: (res, data) => {
		res.send(200, {
			status: 'success',
			data: data
        });
    },
    
    sendError: (res, httpCode, errorMessage) => {
        res.send(httpCode, {
            status:'error',
            message: errorMessage
        });
    },
    parseUser: (data)=>{
        var userData = {
            id: data._id,
            firstname: data.firstname,
            lastname: data.lastname,
            phone: data.phone,
            email: data.email
        }

        return userData;
    },
}

module.exports = helper; 