#!/usr/bin/env bash

# disable selinux for current boot
setenforce 0

# disable selinux permanently
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/sysconfig/selinux
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config

yum install -q -y epel-release

# Install mysql 8 , elastic and node.js 10 repos
cp /vagrant/VagrantScripts/elastic.repo /etc/yum.repos.d/
yum install -y https://dev.mysql.com/get/mysql80-community-release-el7-1.noarch.rpm
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -

# Enable installation after epel is installed
yum install -q -y ntp vim-enhanced wget git nodejs mysql-community-server mysql-shell nginx tree elasticsearch java-1.8.0-openjdk-headless

# Set the correct time
ntpdate -u pool.ntp.org

# Enable & start ntp/mariadb
systemctl enable ntpd
systemctl enable mariadb
systemctl start ntpd
systemctl start mariadb

PHP_VERSION="71"
# PHP 7.1.x install:
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
  php${PHP_VERSION}-php-bcmath \
  php${PHP_VERSION}-php-xml

ln -s /usr/bin/php${PHP_VERSION} /usr/bin/php

# Copy config files
cp /vagrant/VagrantScripts/nginx.conf /etc/nginx/nginx.conf
cp /vagrant/VagrantScripts/www.conf /etc/opt/remi/php71/php-fpm.d/www.conf

# Setup more sane dev environment (vim + git settings)
sudo -u vagrant cp /vagrant/VagrantScripts/vimrc /home/vagrant/.vimrc
sudo -u vagrant git config --global color.ui auto

#
chgrp vagrant /var/opt/remi/php71/lib/php/session
chgrp vagrant /var/opt/remi/php71/lib/php/wsdlcache
chgrp vagrant /var/opt/remi/php71/lib/php/opcache
chown vagrant /var/opt/remi/php71/log/php-fpm

# Increase php memory limit
sed -i 's/memory_limit = 128M/memory_limit = 770M/' /etc/opt/remi/php71/php.ini

# Create directory and database for magento + proxy
mkdir -p /services/magento
cp -R /vagrant/VagrantScripts/tools /services
chown vagrant:vagrant -R /services

mysqladmin -u root create magento2
mysqladmin -u root create magentoproxy
mysql -u root -e "grant all privileges on magento2.* to 'magento'@'localhost' identified by 'magentopass1234';"
mysql -u root -e "grant all privileges on magentoproxy.* to 'mageproxy'@'localhost' identified by 'proxypass1234';"
mysqladmin -u root flush-privileges

# Reinstall npm packages
cd /vagrant/frontend ; rm -rf node_modules
sudo -u vagrant npm ci
sudo -u vagrant npm run build

cd ../proxy ; rm -rf node_modules
sudo -u vagrant npm ci

# Reduce elasticsearch memory usage
sed -ie 's/Xms2g/Xms768m/' /etc/elasticsearch/jvm.options
sed -ie 's/Xmx2g/Xmx768m/' /etc/elasticsearch/jvm.options

# Enable more services
systemctl enable nginx
systemctl enable php71-php-fpm
systemctl enable elasticsearch

systemctl start nginx
systemctl start php71-php-fpm
systemctl start elasticsearch

# Install magento
cd /services/magento
sudo -u vagrant tar xf /vagrant/VagrantScripts/Magento-CE-2.2.7_sample_data-2018-11-20-11-35-47.tar.bz2
sudo -u vagrant php bin/magento setup:install \
    --db-user=magento --db-password=magentopass1234 --db-name=magento2 \
    --admin-firstname=vagrant --admin-lastname=vagrant --admin-user=admin\
    --admin-password=pass1234 --admin-email="changeme@mailinator.com" --backend-frontname="admin_abc1"\
    --base-url=http://localhost:3090/

# Install composer
cp /vagrant/VagrantScripts/composer.phar /usr/local/bin/composer

# Disable magentos caches and enable developer mode
#sudo -u vagrant php bin/magento cache:disable
#sudo -u vagrant php bin/magento deploy:mode:set developer

# Install ElasticIndexer module
cd /services/magento

#sudo -u vagrant /usr/local/bin/composer config repositories.0 vcs https://github.com/mcfizh/elasticindexer
#sudo -u vagrant /usr/local/bin/composer require --prefer-source "mcfish/elasticindexer"

#sudo -u vagrant php bin/magento setup:upgrade
#sudo -u vagrant php bin/magento setup:di:compile

# Create magento integration & change config values
cd /services/tools
sudo -u vagrant php integration.php
sudo -u vagrant php changeConfigs.php

# Flush cache
cd /services/magento
sudo -u vagrant php bin/magento cache:flush

# Create cron job for vagrant user
sudo -u vagrant crontab /vagrant/VagrantScripts/cron
