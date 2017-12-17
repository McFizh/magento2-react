This repo contains the following: Magento 2.2.1, React UI and Hapi.js REST proxy between react and magento. **This is not a react theme for magento**, but a complete replacement of the frontend. Idea is that the magento is running in the background as headless system, so customers never really interact directly with magento (except for the store owner who can access the admin interface).

## Current state of this project

[ ] WIP: ElasticIndexer module, which reads in data from magento.  
[ ] WIP: Ajax search api for proxy and search support for client  
[ ] WIP: CMS page support to proxy and client  
[X] Proxy reads in categories and client can show them in dropdown  
[X] Vagrant sets up initial environment (react, node, magento)  

## Technical description

* Magento is running almost in vanilla state. There are two things that are modified:
  * VagrantScripts/tools/integration.php script creates integration keys, so that proxy can read data from API
  * VagrantScripts/base.sh script enables elasticindexer module (WIP), which indexes product data to elasticsearch engine for proxy to use

* Proxy that lives between magento and react app, is running on node.js 8.x.x and uses hapi.js framework. It stores it's data to arangodb (similar to mongodb) and also uses elasticsearch engine for ajax search. Proxy reads in data from magento using delta updates and then provides the data to react app in lesser amount of requests.

* React frontend .. This application communicates only with node.js proxy, which caches the data for client use.

## Vagrant environment

If you want to try this system out, I have provided vagrant scripts that create ready to use environment.

Before starting up environment, **replace** empty file "Magento-CE-2.2.1_sample_data-2017-11-04-12-09-15.tar.bz2" in VagrantScripts-folder with a proper downloaded copy of magento with sampledata. This can't be done automatically, thanks to some braindead policy of keeping downloads behind login.

Vagrantfile assumes you are using vmware fusion (osx) provider, make necessary changes if using something else like virtualbox. To try out the environment, start up virtual machine with command **vagrant up** . This takes some time, so reserve lots of coffee :)

After the machine has been brought up, you can access magento admin via url:

http://localhost:3090/admin_abc1

Username is: **admin** and password is: **pass1234**

Current script doesn't start up node.js proxy, so you must manually ssh to the machine and start it up like so:

* vagrant ssh
* cd /vagrant/proxy
* node .

Leave node running on the background, and now you should (tm) be able to access react app with url: http://localhost:3080/

If you want to start development server for frontend, use command "npm start" in folder '/vagrant/frontend'.

## Notes

**npm start** will fail, if you have installed node modules outside vagrant environment and vice versa. That's why we remove node_modules folder on init.
