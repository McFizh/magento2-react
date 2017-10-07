const Arangojs = require('arangojs');
const SuperAgent = require('superagent');

var arangodb = null;
var ApiConfig = {};
var magentoCategories;

function init(apiConfig) {

	// Is init called multiple times?
	if(arangodb != null)
		return;

	//
	ApiConfig = apiConfig;
	magentoCategories = {};

	// Create connection to ArangoDB
	arangodb = new Arangojs.Database({
		url: 'http://proxy:simplepassword@localhost',
		databasename: "magentoproxy"
	});
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function getCategories(onlyActive) {
	
}

function doCategoryRequest() {
	SuperAgent
	    .get("http://localhost:90/index.php/rest/V1/categories")
	    .set('Authorization','Bearer '+ApiConfig.token)
	    .end(handleCategoryRequestResponse);
}

function handleCategoryRequestResponse(err, res) {
	if(!err) {
		console.log(res.text);
	}
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

module.exports = {
	init: init,
	doCategoryRequest: doCategoryRequest,
	getCategories: getCategories
};
