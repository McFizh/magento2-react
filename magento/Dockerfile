FROM php:7.2-apache
WORKDIR /var/www/html
USER www-data
COPY Magento-CE-2.2.11_sample_data-2020-01-24-07-33-41.tar.bz2 .
RUN tar xf Magento-CE-2.2.11_sample_data-2020-01-24-07-33-41.tar.bz2 && \
  rm *.tar.bz2