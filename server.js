'use strict';

/**
 * Module Dependencies
 */
const config = require('app/config/config.js');
const restify = require('restify');
const mongoose = require('mongoose');
const serviceLocator = require('app/config/serviceLocator.js');
const logger = serviceLocator.get('logger');

const restifyPlugins = restify.plugins;

/**
  * Initialize Server
  */
const server = restify.createServer({
	name: config.info.name,
	version: config.info.version,
});

/**
  * Middleware
  */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());
/**
  * Start Server, Connect to DB & Require Routes
  */
server.listen(config.port, () => {
	//establish connection to mongodb
	mongoose.Promise = global.Promise;
	mongoose.connect(config.db.uri);

	const db = mongoose.connection;

	db.on('error', (err) => {
	    logger.error(err);
	    process.exit(1);
	});

	db.once('open', () => {
	    require('app/routes/routes.js')(server, serviceLocator);
	    logger.info(`Server is listening on port ${config.port}`);
    });
});