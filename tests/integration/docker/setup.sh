# Move away the LocalSettings.php, install.php won't work if this file is present
mv ./LocalSettings.php /tmp/LocalSettings.php

php maintenance/install.php Wikipedia wikiuser --pass=wikipassword \
  --server=http://localhost:8080 \
	--dbserver=database \
	--dbtype=mysql \
	--dbname=my_wiki \
	--dbprefix="" \
	--installdbuser=wikiuser \
	--installdbpass=wikipassword \
	--dbuser=wikiuser \
	--dbpass=wikipassword \
	--scriptpath="" \
	--extensions=SpamBlacklist,TitleBlacklist

# Chuck the auto-generated LocalSettings.php and bring back ours
rm -rf ./LocalSettings.php && mv /tmp/LocalSettings.php ./LocalSettings.php

# Run update.php so that database tables needed for extensions are created
php maintenance/update.php --quick

# Include every grant in bot password, too bad there isn't an --all-grants option
php maintenance/createBotPassword.php --appid=bp --grants=basic,blockusers,createaccount,createeditmovepage,delete,editinterface,editmycssjs,editmyoptions,editmywatchlist,editpage,editprotected,editsiteconfig,highvolume,mergehistory,oversight,patrol,privateinfo,protect,rollback,sendemail,uploadeditmovefile,uploadfile,viewdeleted,viewmywatchlist,viewrestrictedlogs Wikiuser 12345678901234567890123456789012

# Create a spare account too
php maintenance/createAndPromote.php Wikiuser2 wikipassword

# Add bot password
php maintenance/createBotPassword.php --appid=bp --grants=basic,blockusers,createaccount,createeditmovepage,delete,editinterface,editmycssjs,editmyoptions,editmywatchlist,editpage,editprotected,editsiteconfig,highvolume,mergehistory,oversight,patrol,privateinfo,protect,rollback,sendemail,uploadeditmovefile,uploadfile,viewdeleted,viewmywatchlist,viewrestrictedlogs Wikiuser2 12345678901234567890123456789012


# Create twinkle change tag
php maintenance/addChangeTag.php --tag twinkle --reason "Testing twinkle"
