'use strict';

const Hapi = require('hapi');
const ApiConfig = require('./config.js');
const AppConfig = require('./settings.js');
const MageClient = require('./mageclient/client.js');
const server = new Hapi.Server({
    host: 'localhost',
    port: 3100
});

// :::::::::::::::::::::::::::::::::::::::::::::::::: //
async function start()
{
    // Init connection to arangodb & elasticsearch engine.. If this
    // fails, nothing works so no reason to continue
    try {
        await MageClient.init(ApiConfig, AppConfig);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }

    //
    console.log( 'Reading in magento categories...' );
    MageClient.doCategoryRequest();
    MageClient.doCmsRequest();

    setTimeout( () => {
        MageClient.getCategories();
    }, 5000);

    // Start up hapi
    try {
        await server.start();
        require("./clientapi/routes.js").routes(server, MageClient);
        console.log( 'Server ( Hapi ver. '+server.version+') running at: ' + server.info.uri );
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

start();
