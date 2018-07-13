'use strict';

const Hapi = require('hapi');

const MageClient = require('./mageclient/client.js');

// :::::::::::::::::::::::::::::::::::::::::::::::::: //
async function init()
{
    // Init connection to arangodb & elasticsearch engine.. If this
    // fails, nothing works so no reason to continue
    try {
        await MageClient.init();
    } catch(err) {
        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable no-console */
        process.exit(1);
    }

    //
    
    /* eslint-disable no-console */
    console.log( '>> Reading in magento categories...' );
    /* eslint-enable no-console */

    MageClient.doCategoryRequest();
    MageClient.doCmsRequest();

    setTimeout( () => {
        MageClient.getCategories();
    }, 5000);

    // Create new hapi server instance
    const server = new Hapi.Server({
        host: 'localhost',
        port: 3100,
        load: {
            sampleInterval: 1000
        }
    });

    // Register modules
    await server.register([
        
    ]);

    // Register routes
    require("./clientapi/routes.js").routes(server);

    // Start up hapi
    try {
        await server.start();
    } catch(err) {
        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable no-console */
        process.exit(1);
    }

    return server;
}

// :::::::::::::::::::::::::::::::::::::::::::::::::: //
init().then((server) => {
    /* eslint-disable no-console */
    console.log('>> HTTP server running on '+server.info.host+':'+server.info.port);
    /* eslint-enable no-console */
});
