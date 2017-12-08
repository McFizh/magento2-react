#!/usr/bin/env bash

# disable selinux for current boot
setenforce 0

# disable selinux permanently
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/sysconfig/selinux
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config

yum install -q -y epel-release

# Install mariadb , elastic , arangodb and node.js 8 repos
curl -sS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash
cp /vagrant/VagrantScripts/elastic.repo /etc/yum.repos.d/
cp /vagrant/VagrantScripts/arangodb.repo /etc/yum.repos.d/
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -

# Enable installation after epel is installed
yum install -q -y ntp vim-enhanced wget git nodejs MariaDB-server nginx tree elasticsearch java-1.8.0-openjdk-headless

# Install arangodb, capture root password
yum install -q -y arangodb3 > /tmp/out1 2>/tmp/out2
grep "the current password is" /tmp/out1 | sed -E "s/.*'([a-zA-Z0-9]*)'.*/\1/" > /root/arangopass

# Set the correct time
ntpdate -u pool.ntp.org

# Enable & start ntp/mariadb
systemctl enable ntpd
systemctl enable mariadb
systemctl enable arangodb3.service
systemctl start ntpd
systemctl start mariadb
systemctl start arangodb3.service

PHP_VERSION="70"
# PHP 7.0.x install:
yum install -q -y http://rpms.remirepo.net/enterprise/remi-release-7.rpm
yum install -q -y \
  php${PHP_VERSION}-php-cli \
  php${PHP_VERSION}-php-fpm \
  php${PHP_VERSION}-php-mysqli \
  php${PHP_VERSION}-php-mbstring \
  php${PHP_VERSION}-php-gd \
  php${PHP_VERSION}-php-mcrypt \
  php${PHP_VERSION}-php-zip \
  php${PHP_VERSION}-php-soap \
  php${PHP_VERSION}-php-opcache \
  php${PHP_VERSION}-php-intl \
  php${PHP_VERSION}-php-xml

ln -s /usr/bin/php${PHP_VERSION} /usr/bin/php

# Create arango database, this is done after installing php to give ADB time to settle
arangosh --server.password=`cat /root/arangopass` < /vagrant/VagrantScripts/arangoCreateDb

# Copy config files
cp /vagrant/VagrantScripts/nginx.conf /etc/nginx/nginx.conf
cp /vagrant/VagrantScripts/www.conf /etc/opt/remi/php70/php-fpm.d/www.conf

#
chgrp vagrant /var/opt/remi/php70/lib/php/session
chgrp vagrant /var/opt/remi/php70/lib/php/wsdlcache
chgrp vagrant /var/opt/remi/php70/lib/php/opcache
chown vagrant /var/opt/remi/php70/log/php-fpm

# Increase php memory limit
sed -i 's/memory_limit = 128M/memory_limit = 770M/' /etc/opt/remi/php70/php.ini

# Create directory and database for magento
mkdir -p /services/magento
cp -R /vagrant/VagrantScripts/tools /services
chown vagrant:vagrant -R /services
mysql -u root -e"create database magento2"

# Reinstall npm packages
cd /vagrant/frontend ; rm -rf node_modules
sudo -u vagrant npm install
sudo -u vagrant npm run build

cd ../proxy ; rm -rf node_modules
sudo -u vagrant npm install

# Reduce elasticsearch memory usage
sed -ie 's/Xms2g/Xms768m/' /etc/elasticsearch/jvm.options
sed -ie 's/Xmx2g/Xmx768m/' /etc/elasticsearch/jvm.options

# Enable more services
systemctl enable nginx
systemctl enable php70-php-fpm
systemctl enable elasticsearch

systemctl start nginx
systemctl start php70-php-fpm
systemctl start elasticsearch

# Install magento
cd /services/magento
sudo -u vagrant tar xf /vagrant/VagrantScripts/Magento-CE-2.2.1_sample_data-2017-11-04-12-09-15.tar.bz2
sudo -u vagrant php bin/magento setup:install \
    --admin-firstname=vagrant --admin-lastname=vagrant --admin-user=admin\
    --admin-password=pass1234 --admin-email="changeme@mailinator.com" --backend-frontname="admin_abc1"\
    --base-url=http://localhost:3090/

# Install composer
cp /vagrant/VagrantScripts/composer.phar /usr/local/bin/composer

# Install ElasticIndexer module
cd /services/magento

sudo -u vagrant /usr/local/bin/composer config repositories.0 vcs https://github.com/mcfizh/elasticindexer
sudo -u vagrant /usr/local/bin/composer require --prefer-source "mcfish/elasticindexer"

sudo -u vagrant php bin/magento setup:upgrade
sudo -u vagrant php bin/magento setup:di:compile

# Create magento integration & change config values
cd /services/tools
sudo -u vagrant php integration.php
sudo -u vagrant php enableSearch.php

# Create cron job for vagrant user
sudo -u vagrant crontab /vagrant/VagrantScripts/cron
