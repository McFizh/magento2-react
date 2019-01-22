const MySql = require('mysql');
const AppConfig = require('../settings');

var connection = null;

function connect() {
    // Is init called multiple times?
    if(connection !== null) {
        return;
    }

    /* eslint-disable no-console */
    console.log('Connecting to MySQL: '+AppConfig.dbhost);
    /* eslint-enable no-console */

    connection = MySql.createConnection({
        host: AppConfig.dbhost,
        user: AppConfig.dbuser,
        password: AppConfig.dbpass,
        database: AppConfig.dbname
    });

    return new Promise( (resolve, reject) => {
        connection.connect( (err) => {
            if (err) {
                reject(err.stack);
            }

            resolve();
        } );
    } );
}

module.exports = {
    connect,
    connection
};
