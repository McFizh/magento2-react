const Arangojs = require('arangojs');
const SuperAgent = require('superagent');

var arangodb = null;
var ApiConfig = {};

function init() {
	if(arangodb != null)
		return;

	arangodb = new Arangojs.Database({
		url: 'http://proxy:simplepassword@localhost',
		databasename: "magentoproxy"
	});
}

function doCategoryRequest() {
	SuperAgent
	    .get("http://localhost:90/index.php/rest/V1/categories")
	    .set('Authorization','Bearer '+ApiConfig.token)
	    .end(function(err,res) {
		if(!err) {
				
			console.log(res.text);
		}
	    });
}


module.exports = {
	init: init,
	doCategoryRequest: doCategoryRequest
};
