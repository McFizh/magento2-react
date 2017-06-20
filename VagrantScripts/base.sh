#!/usr/bin/env bash

# disable selinux for current boot
setenforce 0

# disable selinux permanently
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/sysconfig/selinux
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config

yum install -q -y epel-release

# Enable installation after epel is installed
yum install -q -y ntp vim-enhanced wget git nodejs mariadb-server nginx

# Set the correct time
ntpdate -u pool.ntp.org

# Enable services
systemctl enable ntpd
systemctl start ntpd

PHP_VERSION="70"
# PHP 7.0.x install:
yum install -q -y http://rpms.remirepo.net/enterprise/remi-release-7.rpm
yum install -q -y \
  php${PHP_VERSION}-php-cli \
  php${PHP_VERSION}-php \
  php${PHP_VERSION}-php-mysqli \
  php${PHP_VERSION}-php-mbstring \
  php${PHP_VERSION}-php-gd \
  php${PHP_VERSION}-php-mcrypt \
  php${PHP_VERSION}-php-xml

ln -s /usr/bin/php${PHP_VERSION} /usr/bin/php

