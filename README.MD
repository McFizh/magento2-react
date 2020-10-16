```
Note: As magento 2.3 now contains improved API and react support, there's no point in trying to continue with this project. So I will keep this repo as is for now, but no futher development will happen.
```

This repo contains the following: Magento 2.2.11, React UI and Express REST proxy between react and magento. **This is not a react theme for magento**, but a complete replacement of the frontend. Idea is that the magento is running in the background as headless system, so customers never really interact directly with magento (except for the store owner who can access the admin interface).

## Current state of this project

[ ] WIP: ElasticIndexer module, which reads in data from magento.
[ ] WIP: Ajax search api for proxy and search support for client
[ ] WIP: CMS page support to proxy and client
[ ] Proxy reads in categories and client can show them in dropdown
[X] Dockerfiles to set up initial environment (react, node, magento)

## Technical description

* Magento is running almost in vanilla state. There are two things that are modified:
  * VagrantScripts/tools/integration.php script creates integration keys, so that proxy can read data from API
  * VagrantScripts/base.sh script enables elasticindexer module (WIP), which indexes product data to elasticsearch engine for proxy to use

* Proxy that lives between magento and react app, is running on node.js 12.x and uses Express framework. It stores it's data to Mariadb and also uses elasticsearch engine for ajax search. Proxy reads in data from magento using delta updates and then provides the data to react app in lesser amount of requests.

* React frontend .. This application communicates only with proxy, which caches the data for client use.

## Docker environment

If you want to try this system out, I have provided docker-compose scripts that create ready to use environment.

Before starting up environment, **replace** empty file "Magento-CE-2.2.11_sample_data-2020-01-24-07-33-41.tar.bz2" in "magento"-folder with a proper downloaded copy of magento with sampledata. This can't be done automatically, thanks to some braindead policy of keeping downloads behind login.

To build magento docker container, and start up the environment, run command:

docker-compose up

After the containers have been brought up, you can access magento admin via url:

http://localhost:3090/admin_abc1

Username is: **admin** and password is: **pass1234**