docker compose up --detach --build
sleep 15 # need to give some time for the database to start working properly

docker compose exec mediawiki bash /var/www/html/setup.sh
