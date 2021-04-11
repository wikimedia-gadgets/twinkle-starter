This directory contains scripts used for *developing* twinkle.

----

Format for credentials.json file:

Set up a bot password via [[Special:BotPasswords]]
```json
{
	"apiUrl": "https://en.wikipedia.org/w/api.php",
	"username": "",
	"password": ""
}
```

OR

Set up an owner-only OAuth credential via [meta:Special:OAuthConsumerRegistration/propose](https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration/propose)
```json
{
	"apiUrl": "https://en.wikipedia.org/w/api.php",
	"OAuthCredentials": {
		"consumerToken": "16_DIGIT_ALPHANUMERIC_KEY",
		"consumerSecret": "20_DIGIT_ALPHANUMERIC_KEY",
		"accessToken": "16_DIGIT_ALPHANUMERIC_KEY",
		"accessSecret": "20_DIGIT_ALPHANUMERIC_KEY"
	}
}
```

Using OAuth will make `server.js` slightly faster in disabling the twinkle gadget version.   

IMPORTANT: Never commit this file to the repository!