var mageClient;

function returnCategoryData(request, reply) {
    var catData = mageClient.getCategories(true);
    reply(catData).code(200);
}


module.exports.routes = function(server, mageclient) {
    mageClient = mageclient;

    let routes = [
        {
            method: 'GET',
            path: '/api/categories',
            config: {
                auth: false,
                handler: returnCategoryData,
                cors: {
                    origin: ["http://localhost:3080","http://localhost:3000"],
                }
            }
        }
    ];

    server.route(routes);
}
