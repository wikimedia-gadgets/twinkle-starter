This directory contains end-to-end tests.

To begin with, install the [playwright](https://www.npmjs.com/package/playwright) npm dependency (version 1.9.1 as of writing): 

```bash
npm install --no-save playwright
```

This is not included as a dev-dependency in `package.json` as it causes a normal `npm install` to slow to a crawl. Playwright installs along with itself binaries for Chromium, Firefox and WebKit browsers for use in tests.

The tests use a MediaWiki instance spun up through a Docker container. You need to have Docker and Docker-compose installed. Run:
```bash
npm run test:integration:setup
```

If all goes well, you should have a wiki running at http://localhost:8080/. Log in with username `Wikiuser` and password `wikipassword`. For API access, use the username `Wikiuser@bp` with the bot password `12345678901234567890123456789012` (sorry, but it needed to be 32 characters!).

You can change the configurations, as well as add or remove extensions used in the MediaWiki instance by editing the [Dockerfile](https://github.com/wikimedia-gadgets/twinkle-starter/blob/master/tests/integration/docker/Dockerfile) and [LocalSettings.php](https://github.com/wikimedia-gadgets/twinkle-starter/blob/master/tests/integration/docker/LocalSettings.php). 

By default, tests run in headless browsers. Per [the jest configuration](https://github.com/wikimedia-gadgets/twinkle-starter/blob/master/jest.config.js), setting the environment variable DEBUG=true will cause playwright tests to run in headful mode, which is helpful for debugging. DEBUG=true will also cause the tests to run only in Chromium rather than all browsers. 


#### Troubleshooting

- If the MW instance setup fails due to a database connection error, this can be fixed by editing the [2nd line of main.sh](https://github.com/wikimedia-gadgets/twinkle-starter/blob/master/tests/integration/docker/main.sh#L2) to increase the number of seconds slept. The database doesn't accept incoming connections till its initialization is complete. 
- If you're using Linux, you may need to install some additional system dependencies for playwright to run. 