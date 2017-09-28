'use strict';

const Hapi = require('hapi');
const ApiConfig = require('./config.js');
const MageClient = require('./mageclient/client.js');
const server = new Hapi.Server();

// :::::::::::::::::::::::::::::::::::::::::::::::::: //
MageClient.init(ApiConfig);
MageClient.doCategoryRequest();

// :::::::::::::::::::::::::::::::::::::::::::::::::: //
server.connection({ port: 3100, host: 'localhost' });

server.start((err) => {
    if(err) {
        throw err;
    }

    console.log( 'Server running at: ' + server.info.uri );
});

