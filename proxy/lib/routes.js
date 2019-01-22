const mageClient = require('../mageclient/client');

function returnCategoryData(request, h) {
    var catData = mageClient.getCategories(true);
    return h.response(catData).code(200);
}

module.exports.routes = function(server) {
    server.route([
        {
            method: 'GET',
            path: '/api/categories',
            config: {
                auth: false,
                handler: returnCategoryData,
                cors: {
                    origin: ['http://localhost:3080','http://localhost:3000'],
                }
            }
        }
    ]);
};
