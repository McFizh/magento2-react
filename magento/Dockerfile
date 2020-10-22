FROM php:7.2-apache
RUN apt-get update && apt install -y less vim mariadb-client libicu-dev zlib1g-dev libxml2-dev \
  libpng-dev libxslt1-dev libjpeg-dev libfreetype6-dev
RUN docker-php-ext-configure gd --with-jpeg-dir=/usr/include --with-freetype-dir=/usr/include --with-png-dir=/usr/include && \
  docker-php-ext-install mysqli pdo pdo_mysql intl zip soap gd bcmath xsl
RUN a2enmod rewrite
COPY magento-php.ini /usr/local/etc/php/conf.d/
COPY 000-default.conf /etc/apache2/sites-available/
WORKDIR /extra
COPY install_magento.sh tools/*.php /extra/
RUN chmod +x install_magento.sh
USER www-data
WORKDIR /var/www/html
COPY Magento-CE-2.2.11_sample_data-2020-01-24-07-33-41.tar.bz2 .
RUN tar xf Magento-CE-2.2.11_sample_data-2020-01-24-07-33-41.tar.bz2 && \
  rm *.tar.bz2
USER root
ENTRYPOINT [ "/extra/install_magento.sh" ]
