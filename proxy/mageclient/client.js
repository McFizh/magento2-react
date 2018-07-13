const Arangojs = require('arangojs');
const SuperAgent = require('superagent');
const ElasticSearch = require('elasticsearch');

const AppConfig = require('../settings');
const ApiConfig = require('../config');

var arangodb = null;
var elasticsearch = null;

var magentoCategories;
var magentoCatIdList;
var catLoader = {
    running: false,
    iterator: 0,
    count: 0
};

async function init() {

    // Is init called multiple times?
    if(arangodb != null)
        return;

    //
    magentoCategories = [];
    magentoCatIdList = [];

    // Create connection to ArangoDB

    /* eslint-disable no-console */
    console.log('Connecting to ArangoDB: '+AppConfig.arangoUri);
    /* eslint-enable no-console */

    arangodb = new Arangojs.Database({ url: AppConfig.arangoUri });
    arangodb.useBasicAuth(AppConfig.arangoUname, AppConfig.arangoPass);
    arangodb.useDatabase(AppConfig.arangoDb);

    // List collections and see if we need to create them
    var collections = await arangodb.listCollections();
    var requiredCollections = ['cmspages','categories'];

    for(let collection of collections) {
        let idx = requiredCollections.indexOf(collection.name);

        if(idx>=0) {
            requiredCollections.splice(idx,1);
        }
    }

    for(let collection of requiredCollections) {
        /* eslint-disable no-console */
        console.log('Creating new collection: '+collection);
        /* eslint-enable no-console */

        let acollection = arangodb.collection(collection);
        await acollection.create();
    }

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
    var uri = AppConfig.magentouri+'/index.php/rest/V1/categories/'+magentoCatIdList[catLoader.iterator].id;

    SuperAgent
        .get( uri )
        .set('Authorization','Bearer '+ApiConfig.token)
        .then( (result) => {

            catLoader.iterator++;

            var catData = JSON.parse(result.text);

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
        .get(AppConfig.magentouri+'/index.php/rest/V1/categories')
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

function doCmsRequest() {
    SuperAgent
        .get(AppConfig.magentouri+'/index.php/rest/V1/cmsPage/search')
        .query({
            'searchCriteria[filter_groups][0][filters][0][field]': 'page_id',
            'searchCriteria[filter_groups][0][filters][0][value]': 0,
            'searchCriteria[filter_groups][0][filters][0][condition_type]': 'gt'
        })
        .set('Authorization','Bearer '+ApiConfig.token)
        .end(handleCmsRequestResponse);
}


function handleCmsRequestResponse(err, res) {
    if(err) {
        console.log(err);
        return;
    }

    let jsonresp = JSON.parse(res.text);
    let pageCollection = arangodb.collection('cmspages');
    let newDocuments = [];

    for(let page of jsonresp.items) {
        newDocuments.push({
            key: page.identifier,
            title: page.title,
            content: page.content,
            active: page.active,
            created: page.creation_time,
            updated: page.update_time
        });
    }

    pageCollection.all().then( (currentPagesCursor) => {
            // Save rest of the pages as new
            function storeRemaining() {
                for(let page of newDocuments) {
                    pageCollection.save(page).then(
                        meta => console.log('Document saved:', meta._rev)
                    ).catch(
                        err => console.error('Failed to save document:', err)
                    );
                }
            }

            // Iterate through database and update / remove documents
            function processNextDoc(cursor) {
                currentPagesCursor.next().then( (doc) => {

                    // What should we do with this document
                    let documentFound=0; // 0 = not found, 1 = found same , 2 = found ; needs update
                    for(let page of newDocuments) {
                        if( page.key == doc.key ) {
                            documentFound = 2;
                            if(page.created == doc.created && page.updated == doc.updated)
                                documentFound = 1;
                        }
                    }

                    // If document was not found at all, means that it has been removed from magento
                    if(documentFound == 0) {
                        //pageCollection.remove({ 
                    }

                    // setImmediate is used to flatten call stack
                    if(currentPagesCursor.hasNext()) {
                        setImmediate( processNextDoc, [ cursor ] );
                    } else {
                        storeRemaining();
                    }

                }).catch( (err) => {
                    console.log(err);
                });
            }

            // Start processing
            if( currentPagesCursor.hasNext() ) {
                processNextDoc(currentPagesCursor);
            } else {
                storeRemaining();
            }

    }).catch( (err) => {
        console.log(err);
    });
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

module.exports = {
    init: init,
    doCategoryRequest: doCategoryRequest,
    doCmsRequest: doCmsRequest,
    getCategories: getCategories
};
