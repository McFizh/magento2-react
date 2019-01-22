const Migrate = require('migrate');

function migrate() {
    return new Promise( (resolve, reject) => {
        Migrate.load({
            stateStore: '.migrate'
        }, (err,set) => {
            if (err) {
                reject(err);
            }

            set.up( err => {
                if (err) {
                    reject(err);
                }
                /* eslint-disable no-console */
                console.log( '>> Migrations successfully ran' );
                /* eslint-enable no-console */
                resolve();
            });
        });
    });
}

module.exports = {
    migrate
};
