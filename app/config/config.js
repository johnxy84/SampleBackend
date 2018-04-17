'use strict';

const config = {
	info: {
		name: 'SampleAPI',
		version: "1.0"
	},
	secretKey: 'SuperDuperSecretKey',
	env: process.env.NODE_ENV || 'development',

	port: process.env.PORT || 9999,
	base_url: process.env.BASE_URL || 'http://localhost:9999',

	//used to setup our logger
	loggerConfig: {
        file: process.env.LOG_PATH || '/tmp/sampleBackend.log',
        level: process.env.LOG_LEVEL || 'info',
        console: process.env.LOG_ENABLE_CONSOLE || true
	},
	
	//db config
	db: {
		uri: process.env.MONGODB_URI || 'mongodb://sample_mongodb',
	},
};

module.exports = config;