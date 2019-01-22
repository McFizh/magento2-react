const DBMigrate = require('db-migrate');

async function migrate() {
    var dbmigrate = DBMigrate.getInstance(true);

    await dbmigrate.run();

    console.log( '>> Migrations successfully ran' );
}

module.exports = {
    migrate
};
