'use strict';

const config = {
	name: 'SampleAPI',
	version: 1.0,
	env: process.env.NODE_ENV || 'development',

	port: process.env.PORT || 9999,
	base_url: process.env.BASE_URL || 'http://localhost:9999',
	
	//db config
	db: {
		uri: process.env.MONGODB_URI || 'mongodb://sample_mongodb',
	},
};

module.exports = config;