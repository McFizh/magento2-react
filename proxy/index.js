'use strict';

const Hapi = require('hapi');
const ApiConfig = require('./config.js');
const arangojs = require('arangojs');
const superAgent = require('superagent');

var arangodb = new arangojs.Database({
	url: 'http://proxy:simplepassword@localhost',
	databasename: "magentoproxy"
});

const server = new Hapi.Server();
server.connection({ port: 3100, host: 'localhost' });

server.start((err) => {
    if(err) {
        throw err;
    }

    console.log( 'Server running at: ' + server.info.uri );
});

console.log("!!");
