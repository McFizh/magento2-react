```
Note: As magento 2.3 now contains improved API and react support, there's no point in trying to continue with this project. So I will keep this repo as is for now, but no futher development will happen.
```

This repo contains the following: Magento 2.2.11, React UI and Express REST proxy between react and magento. **This is not a react theme for magento**, but a complete replacement of the frontend. Idea is that the magento is running in the background as headless system, so customers never really interact directly with magento (except for the store owner who can access the admin interface).

## Current state of this project

- [ ] WIP: ElasticIndexer module, which reads in data from magento.
- [ ] WIP: Ajax search api for proxy and search support for client
- [ ] WIP: CMS page support to proxy and client
- [ ] Proxy reads in categories and client can show them in dropdown
- [x] Dockerfiles to set up initial environment (react, node, magento)

## Technical description

* Magento is running almost in vanilla state. The following change(s) are made in install_magento.sh script:
  * magento/tools/integration.php script creates integration keys, so that proxy can read data from REST API

* Proxy that lives between magento and react app, is running on node.js 12.x and uses Express framework. Data is stored to MariaDB and updated from Magentoa in predefined intervals. Idea is that proxy can provide required data to frontend with lesser amount of queries.

* React frontend communicates only with the proxy server.

* Both the proxy and the frontend have been implemented with typescript

## Docker environment

If you want to try this system out, there's docker-compose.yml file that create ready to use environment.

Before starting up environment, **replace** empty file "Magento-CE-2.2.11_sample_data-2020-01-24-07-33-41.tar.bz2" in "magento"-folder with a proper downloaded copy of magento with sampledata. This can't be done automatically, thanks to some braindead policy of keeping downloads behind login.

Also set the following kernel value. You can add the value to /etc/sysctl.conf as permanent solution, or set it once with sysctl command. Value can be higher but not lower, this is required for elasticsearch to work:

vm.max_map_count = 262144

To build magento docker container, and start up the environment, run command:

docker-compose up

After the containers have been brought up, you can access magento admin via url:

http://localhost:3090/admin_abc1

Username is: **admin** and password is: **pass1234**

Note. Docker environment writes the access token to shared folder with name config.js