#!/bin/bash

DB_PWD="mysql-root-pwd"
DB_HOST="database"

## Wait for database to come up
RETRIES=6
until mysql -u root -h $DB_HOST -p$DB_PWD -e "select 1" > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "Waiting for mysql to come up, $((RETRIES--)) remaining attempts..."
  sleep 3
done

## Create database users (if not created already)
DB_USERS=`mysql -u root -h $DB_HOST -p$DB_PWD mysql -B --disable-column-names -e "select User from user"`
if [[ ! "$DB_USERS" =~ "magento" ]]; then
	echo "Creating database users..."
	mysql -u root -h $DB_HOST -p$DB_PWD -e "create database magentoproxy"
	mysql -u root -h $DB_HOST -p$DB_PWD -e "create user 'magento'@'%' identified by 'Magentopass_1234'"
	mysql -u root -h $DB_HOST -p$DB_PWD -e "create user 'mageproxy'@'%' identified by 'Magentopass_1234'"
	mysql -u root -h $DB_HOST -p$DB_PWD -e "grant all privileges on magento.* to 'magento'@'%'"
	mysql -u root -h $DB_HOST -p$DB_PWD -e "grant all privileges on magentoproxy.* to 'mageproxy'@'%'"
fi

## Install magento
if [ ! -f "/var/www/html/app/etc/config.php" ]; then
  echo "Installing magento..."
  su -l -s /bin/sh www-data -c '/usr/local/bin/php /var/www/html/bin/magento setup:install \
    --db-user=magento --db-password=Magentopass_1234 --db-host='$DB_HOST' --db-name=magento \
    --admin-firstname=docker --admin-lastname=createby \
    --admin-user=admin --admin-password=pass1234 --admin-email="changeme@mailinator.com" \
    --backend-frontname="admin_abc1" --use-rewrites=1 \
    --base-url=http://localhost:3090/'

  echo "Creating integration keys..."
  su -l -s /bin/sh www-data -c '/usr/local/bin/php /extra/integration.php'
  mv /tmp/config.json /shared/
fi

## Start up apache
apache2-foreground