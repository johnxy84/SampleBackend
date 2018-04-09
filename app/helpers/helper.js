'use strict';

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
    }
}

module.exports = helper; 