FROM mediawiki

WORKDIR /var/www/html

# TODO: import PGP keys with the full fingerprint to check signatures and/or embed checksums

# Install composer
RUN php -r "readfile('https://getcomposer.org/installer');" | php && \
    mv composer.phar /usr/local/bin/composer

RUN git clone --depth 1 --branch REL1_35 https://github.com/wikimedia/mediawiki-extensions-AbuseFilter.git extensions/AbuseFilter
RUN git clone --depth 1 --branch REL1_35 https://github.com/wikimedia/mediawiki-extensions-FlaggedRevs.git extensions/FlaggedRevs
RUN git clone --depth 1 --branch REL1_35 https://github.com/wikimedia/mediawiki-extensions-TemplateStyles.git extensions/TemplateStyles && \
    composer install --no-dev --working-dir extensions/TemplateStyles

COPY . .
