const Arangojs = require('arangojs');
const SuperAgent = require('superagent');
const ElasticSearch = require('elasticsearch');

var arangodb = null;
var elasticsearch = null;

var magentoCategories;
var magentoCatIdList;
var catLoader = {
    running: false,
    iterator: 0,
    count: 0
};

var ApiConfig = {};
var AppConfig = {};

function init(apiConfig, appConfig) {

    // Is init called multiple times?
    if(arangodb != null)
        return;

    //
    ApiConfig = apiConfig;
    AppConfig = appConfig;
    magentoCategories = [];
    magentoCatIdList = [];

    // Create connection to ArangoDB
    arangodb = new Arangojs.Database({
        url: AppConfig.arangodburi,
        databasename: "magentoproxy"
    });

    // Create connection to elasticsearch
    elasticsearch = new ElasticSearch.Client({
        host: AppConfig.elasticuri,
        log: 'trace'
    });
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function getCategories(onlyActive) {
    // Return the whole category structure
    if(!onlyActive) {
        return magentoCategories;
    }

    // Return only active categories
    function catListIterator(catData) {
        let catList = [];

        for(let cat of catData) {
            if(!cat.is_active)
                continue;

            let t_cat = cat;
            t_cat.childs = catListIterator(cat.childs);
            catList.push(t_cat);
        }

        return catList;
    }

    return catListIterator(magentoCategories);
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function loadCategoryData() {
    if(catLoader.running)
        return;

    catLoader.running = true;
    catLoader.iterator = 0;
    catLoader.count = magentoCatIdList.length;
    catLoader.count = 4;

    handleCatLoaderEvent();   
}

function handleCatLoaderEvent() {
    var uri = AppConfig.magentouri+"/index.php/rest/V1/categories/"+magentoCatIdList[catLoader.iterator].id;

    SuperAgent
        .get( uri )
        .set('Authorization','Bearer '+ApiConfig.token)
        .then( (result) => {

            catLoader.iterator++;

            var catData = JSON.parse(result.text);
            console.log(catData);

            if( catLoader.iterator < catLoader.count ) {
                handleCatLoaderEvent();
            } else {
                catLoader.running = false;
            }
        });
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function doCategoryRequest() {
    SuperAgent
        .get(AppConfig.magentouri+"/index.php/rest/V1/categories")
        .set('Authorization','Bearer '+ApiConfig.token)
        .end(handleCategoryRequestResponse);
}

function handleCategoryRequestResponse(err, res) {
    if(err) {
        magentoCategories = [];
        magentoCatIdList = [];
        return;
    }

    //
    let jsonresp = JSON.parse(res.text);
    if( !(jsonresp instanceof Array) ) {
        jsonresp = [ jsonresp ];
    }

    //
    function catListIterator(rawCatData, newCatData) {
        let catList = [];

        for(let cat of rawCatData) {
            let newCat = {
                id: cat.id,
                name: cat.name,
                is_active: cat.is_active,
                level: cat.level,
                loaded: false,
                childs: []
            };

            if(cat.children_data.length > 0) {
                newCat.childs = catListIterator(cat.children_data);
            }

            catList.push(newCat);
            magentoCatIdList.push({
                id: cat.id, 
                loaded: false
            });
        }

        return catList;
    }

    //
    magentoCategories = catListIterator(jsonresp);

    // Initiate category data loading
    loadCategoryData();
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

module.exports = {
    init: init,
    doCategoryRequest: doCategoryRequest,
    getCategories: getCategories
};
