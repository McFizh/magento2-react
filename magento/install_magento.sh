#!/bin/bash

DB_PWD="mysql-root-pwd"
DB_HOST="database"

## Wait for database to come up
RETRIES=5
until mysql -u root -h $DB_HOST -p$DB_PWD -e "select 1" > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "Waiting for mysql to come up, $((RETRIES--)) remaining attempts..."
  sleep 2
done

## Create database users (if not created already)
DB_USERS=`mysql -u root -h $DB_HOST -p$DB_PWD mysql -B --disable-column-names -e "select User from user"`
if [[ ! "$DB_USERS" =~ "magento" ]]; then
	echo "Creating database users..."
	mysql -u root -h $DB_HOST -p$DB_PWD -e "create database magentoproxy"
	mysql -u root -h $DB_HOST -p$DB_PWD -e "create user 'magento'@'127.0.0.1' identified by 'Magentopass_1234'"
	mysql -u root -h $DB_HOST -p$DB_PWD -e "create user 'mageproxy'@'127.0.0.1' identified by 'Magentopass_1234'"
	mysql -u root -h $DB_HOST -p$DB_PWD -e "grant all privileges on magento.* to 'magento'@'127.0.0.1'"
	mysql -u root -h $DB_HOST -p$DB_PWD -e "grant all privileges on magentoproxy.* to 'mageproxy'@'127.0.0.1'"
fi

## Install magento
echo "Installing magento..."
su -l -s /bin/sh www-data -c '/usr/local/bin/php /var/www/html/bin/magento setup:install \
  --db-user=magento --db-password=Magentopass_1234 --db-host 127.0.0.1 --db-name=magento \
  --admin-firstname=docker --admin-lastname=createby \
  --admin-user=admin --admin-password=pass1234 --admin-email="changeme@mailinator.com" \
  --backend-frontname="admin_abc1" \
  --base-url=http://localhost:3090/'

apache2-foreground