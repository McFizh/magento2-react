'use strict';

const Hapi = require('hapi');
const ApiConfig = require('./config.js');
const AppConfig = require('./settings.js');
const MageClient = require('./mageclient/client.js');
const server = new Hapi.Server();

// :::::::::::::::::::::::::::::::::::::::::::::::::: //

console.log( 'Reading in magento categories...' );
MageClient.init(ApiConfig, AppConfig);
MageClient.doCategoryRequest();

setTimeout( () => {
	MageClient.getCategories();
}, 5000);

// :::::::::::::::::::::::::::::::::::::::::::::::::: //
server.connection({ port: 3100, host: 'localhost' });

server.start((err) => {
    if(err) {
        throw err;
    }

    require("./clientapi/routes.js").routes(server, MageClient);

    console.log( 'Server running at: ' + server.info.uri );
});

