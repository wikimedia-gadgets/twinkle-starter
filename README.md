
# twinkle-starter

This is a template repository to create a Twinkle customisation for a new wiki. 

**NOTE: Twinkles generated with this template some time ago may no longer be working. To fix the issue(s), ensure you've the following patches applied: [package.json & webpack.config.json](https://github.com/wikimedia-gadgets/twinkle-starter/commit/8c232ae104455d87c58293b1ed4cb51c8e827ffd), [dev-loader.js](https://github.com/wikimedia-gadgets/twinkle-starter/pull/22/commits/484144e21ba0fa58f1bcb7d41782fe8c978f88f4), [Gruntfile.js](https://github.com/wikimedia-gadgets/twinkle-starter/commit/28c846bac) Also ensure you're using the latest version of twinkle-core (v3.1.2).**

## Getting Started
You need to have the following installed on your system: (i) [Git](https://git-scm.com/downloads), (ii) [Node.js](https://nodejs.org/en/download/) v13 or above, (iii) npm – though this usually comes along with Node.js. You'll also need to have some basic JavaScript familiarity. 

- To use this template, click on the ![Use this template](https://user-images.githubusercontent.com/6702424/98155461-92395e80-1ed6-11eb-93b2-98c64453043f.png) button near the top (don't clone this repo). Give your repo a suitable name, such as "twinkle-frwiki" if it is for the French Wikipedia. The [template initialisation workflow](https://github.com/wikimedia-gadgets/twinkle-starter/blob/master/.github/workflows/template_initialization.yaml) will shortly create a new commit in your repository replacing the placeholders in the package.json file. If you don't wish to use GitHub, please see [the note below](#user-content-use-a-source-code-host-other-than-github).

- Clone the generated repo: (remember to replace "twinkle-frwiki" in the commands with the actual name of your repository!) 
```bash
git clone https://github.com/wikimedia-gadgets/twinkle-frwiki.git
cd twinkle-frwiki
```

- Now, run `npm install`.
- Add code for registering the customisations/localisations needed for your wiki (see sections below). You can test your changes as you go with `npm start`. See details in [Development section below](#user-content-development). This is the longest step in the workflow.
- Translate messages in twinkle-core to your language if someone hasn't already done so on translatewiki.net (see [section below](#user-content-twinkle-core-message-translations)).
- When you're done, use the `grunt build` command to generate files that you can actually copy over to the wiki (see [Deployment section below](#user-content-deployment) for details). 

This repo contains has all the dependencies and build tool configurations present so that you don't have to bother with them. The most significant dependency is [**twinkle-core**](https://github.com/wikimedia-gadgets/twinkle-core) which provides all the core functionality on top of which you can write your customisations and extensions. There exists automatically generated **[Code Documentation for twinkle-core](https://tools-static.wmflabs.org/twinkle/core-docs)** which provides details on functioning of its various modules.

Twinkle-core uses [TypeScript](https://www.typescriptlang.org/) – a compiled superset of JavaScript that makes it easier to write bug-free applications. You can choose to write your customisations in either JavaScript or TypeScript. However, using JavaScript files causes all type-safety features built into twinkle-core to be side-stepped, which may make it harder to debug. Since TypeScript is a superset of JavaScript, all JS code is also valid TS code; as such you can write JS code in TS files – this should still make it easier to catch errors. If you are new to TypeScript, refer to the [official documentation's introduction for JS programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

All code is written in the form of [ECMAScript modules](https://webpack.js.org/guides/ecma-script-modules/). Webpack is used to "bundle" all the code (including dependencies) into a single file – which you can upload to the wiki (see [Deployment section](#user-content-deployment)). 

### twinkle.ts 
`twinkle.ts` file is the entry point. Specify all site-specific configurations here. The list of module classes is also put here.

### Extending core modules
As of now, twinkle-core provides the following modules: 
- [Fluff](https://twinkle.toolforge.org/core-docs/classes/fluffcore.html) - Revert and rollback 
- [Diff](https://twinkle.toolforge.org/core-docs/classes/diffcore.html) - Show additional diff links
- [Tag](https://twinkle.toolforge.org/core-docs/classes/tagcore.html) - Add maintenance tags to pages 
- [XFD](https://twinkle.toolforge.org/core-docs/classes/xfdcore.html) - Nominate pages for deletion discussions.
- [Speedy](https://twinkle.toolforge.org/core-docs/classes/speedycore.html) - Nominate pages for speedy deletion, and (for admins) delete pages
- [Warn](https://twinkle.toolforge.org/core-docs/classes/warncore.html) - Warn users for vandalism or other issues
- [Block](https://twinkle.toolforge.org/core-docs/classes/blockcore.html) - (for admins) Block users and place a block template on the talk page
- [Protect](https://twinkle.toolforge.org/core-docs/classes/protectcore.html) - Request page protection, (for admins) protect pages and add protection templates 
- [Unlink](https://twinkle.toolforge.org/core-docs/classes/unlinkcore.html) - Remove links to a given page from all other pages
- [BatchDelete](https://twinkle.toolforge.org/core-docs/classes/batchdeletecore.html) - (for admins) batch page deletions
- [BatchUndelete](https://twinkle.toolforge.org/core-docs/classes/batchundeletecore.html) - (for admins) batch undeletion of pages linked from a given page

Of these, Fluff and Diff modules work out of the box. The remaining need some configuration. Refer to the documentation of each module for guidance on configuring them. Fluff, Diff, Unlink, BatchDelete and BatchUndelete require virtually no configuration.

Each module in Twinkle extends the abstract class [TwinkleModule](https://twinkle.toolforge.org/core-docs/classes/twinklemodule.html). Some core module classes are also abstract, indicating they don't work by themselves and must be extended with the specified abstract fields or methods that you have to provide.  

Customisation written for English Wikipedia at [wikimedia-gadgets/twinkle-enwiki](https://github.com/wikimedia-gadgets/twinkle-enwiki) can be used as a reference.

### Creating your own modules
Apart from extending the core module, you can also create your own modules customised to the needs of your wiki. In general, a Twinkle module is structured as follows:

```js
import { TwinkleModule } from './core';

// A singleton class: only one instance is ever created
class MyCustomModule extends TwinkleModule {
	
	moduleName = 'CustomModule';
	
	// Entry point. Calling the constructor should create the menu item for this module
	constructor() {
		// addMenu() call creates the menu item in the Twinkle portlet
		addMenu();
    }
	
	// When the menu item is clicked, this function is invoked,
    // Creates the dialog with a form into which a user can enter inputs  
	makeWindow() {  }
	
	// Triggerred when the form is submitted 
	evaluate() {  }
}
```

### Twinkle-core message translations
Twinkle-core uses translatewiki.net for message translations (https://translatewiki.net/wiki/Translating:Twinkle). Check if its messages are available in your wiki's language (https://github.com/wikimedia-gadgets/twinkle-core/tree/master/i18n). For messages that aren't available:
* Consider contributing the translations directly to translatewiki.net – these messages will be used by all twinkle installations in that language
* If you can't contribute to translatewiki.net or if there are any messages that you want to be project-specific rather than language-specific, then define them in the `src/messages.json` file. Any messages in this file will override messages coming from translatewiki.net.


## Development

Firstly, you'll want to make sure your editor is properly configured to work with TypeScript. For example, you may need to install a plugin (such as atom-typescript if you use atom editor), in order to fully take advantage of TypeScript. If you use VS Code, TypeScript support is built-in, so no extensions are required.

Commands:
- `npm start` - this creates a quick build of the project which you can test by loading `mw.loader.load('http://localhost:5500');` from your on-wiki common.js page (or from the browser console). 
- `grunt build` - this creates a minified single-file build that you copy over to the wiki (see Deployment below).

Use your [browser console](https://developer.mozilla.org/en-US/docs/Tools/Web_Console/Console_messages) to look out for any JavaScript errors (usually opened via Ctrl+Shift+J or Cmd+Option+J or F12).

### Browser compatibility
Twinkle-core is compatible with all browsers for which MediaWiki provides JavaScript support. Do check MDN docs or [caniuse.com](https://caniuse.com/) before using modern browser APIs to ensure that they're supported in most browsers.

### Writing automated tests
<details>
	<summary><i>Unnecessary to begin with. Click to expand.</i></summary>
Twinkle-starter comes with a test suite which uses Jest, <a href="https://www.npmjs.com/package/mock-mediawiki">mock-mediawiki</a> and <a href="https://www.npmjs.com/package/playwright">playwright</a>. Unit tests for utility functions can be written with mock-mediawiki for mocking any <code>mw.*</code> functions if necessary. 

For writing integration tests, you can spin up a MediaWiki instance using Docker, use playwright for browser automation, and mwn for setting up test fixtures via the API and checking results. See <a href="https://github.com/wikimedia-gadgets/twinkle-starter/tree/master/tests/integration/README.md">integration/README.md</a> for details. However, note that writing integration tests is quite time-consuming and is likely overkill, unless you plan to make frequent changes. 
</details>

## Deployment

To generate a production build, run `grunt build`. This build minimises the code and surrounds it within nowiki tags after escaping all existing nowiki tags. A header is also inserted. The morebits.js and morebits.css files are copied over from twinkle-core dependency.

#### Deploy as a gadget
Edit MediaWiki:Gadgets-definition to add the Twinkle gadget:
```
*Twinkle[ResourceLoader|dependencies=ext.gadget.morebits,ext.gadget.select2,mediawiki.storage,mediawiki.libs.pluralruleparser,mediawiki.api|type=general|peers=Twinkle-pagestyles]|Twinkle.js|Twinkle.css
*morebits[ResourceLoader|dependencies=mediawiki.user,mediawiki.util,mediawiki.Title,jquery.ui|hidden]|morebits.js|morebits.css
*Twinkle-pagestyles[hidden|skins=vector]|Twinkle-pagestyles.css
*select2[ResourceLoader|hidden]|select2.min.js|select2.min.css
```

Copy the [MediaWiki:Gadget-select2.min.js](https://en.wikipedia.org/wiki/MediaWiki:Gadget-select2.min.js) and [MediaWiki:Gadget-select2.min.css](https://en.wikipedia.org/w/index.php?title=MediaWiki:Gadget-select2.min.css) files as-it-is from enwiki. These are _not_ exact copies of the CDN versions. A small change is applied to them to make them work with MediaWiki ResourceLoader. These files should never need to be edited once created.

You can deploy manually by copying all files in the build directory (created by running `grunt build`) to the wiki.

Or to make it simpler, you can also use the [deploy.js script](https://github.com/wikimedia-gadgets/twinkle-starter/blob/master/scripts/deploy.js): 
- Create a [bot password](https://www.mediawiki.org/wiki/Manual:Bot_passwords) or set up [OAuth credentials (owner-only)](https://www.mediawiki.org/wiki/OAuth/Owner-only_consumers). Ensure you provide the sufficient rights.
- Optional: Create a `credentials.json` file with [your login information in the appropriate format](https://github.com/wikimedia-gadgets/twinkle-starter/blob/master/scripts/README.md). If this is not done, the deploy script will prompt you for the username and password.
- Adjust the `deployTargets` field in deploy.js script as appropriate. Run it.

#### Deploy as a user script

Twinkle can also be made to work as a userscript. However, this will be slightly slower than the gadget version.

After running `grunt build`, copy the files from the build directory to your userspace on-wiki. Skip Twinkle-pagestyles.css - it is not useful in a userscript context.

Copy [MediaWiki:Gadget-select2.min.js](https://en.wikipedia.org/wiki/MediaWiki:Gadget-select2.min.js) and [MediaWiki:Gadget-select2.min.css](https://en.wikipedia.org/w/index.php?title=MediaWiki:Gadget-select2.min.css) files as-it-is from enwiki to your userspace. 

Create a central loader (say [[User:Example/twinkle.js]]):
```js
mw.loader.using([
	'mediawiki.user', 'mediawiki.util', 'mediawiki.Title', 'mediawiki.api',
	'mediawiki.storage', 'mediawiki.libs.pluralruleparser'
]).then(function () {
	function load(pageName, css) {
		return mw.loader.getScript(
			'/w/index.php?title=User:Example/' + pageName + '&action=raw&ctype=text/' + (css ? 'css' : 'javascript'), 
			css ? 'text/css' : null  
        );
	}
	mw.loader.load('jquery.ui');

	// Morebits needs to be available for twinkle.js to parse
	load('twinkle/morebits.js').then(function() {
		load('twinkle/twinkle.js');
	});
	load('twinkle/select2.js');
	load('twinkle/twinkle.css', true);
	load('twinkle/morebits.css', true);
	load('twinkle/select2.css', true);
});
```

In theory, the fetch of i18n messages and twinkleconfig could be parallelized with fetching of the twinkle source files to make loads faster ([Issue 3](https://github.com/wikimedia-gadgets/twinkle-core/issues/3)). 

## Update and maintenance

Since twinkle-core is bundled along into your customisation code into a single file as part of the build step, any updates in twinkle-core will not automatically reflect on your wiki. This is by design – because it means that any unexpected change in twinkle-core will not break your customisations. Once you've properly set up Twinkle and it works, it will continue to work and is not affected by changes in twinkle-core.

Any breaking changes in MediaWiki itself may however cause your working Twinkle to suddenly break. This is beyond our control – but this should be rare. Everytime this happens and something in twinkle-core breaks, a new version will be released so that you can update to it (see next section).

### Upgrading version of twinkle-core
You may want to remain up-to-date with the version of twinkle-core you're using so that any new features added to it will be available. To make this convenient for you, twinkle-starter uses [dependabot](https://dependabot.com/) (see [configuration file](https://github.com/wikimedia-gadgets/twinkle-starter/blob/master/.github/dependabot.yml)). Every time a new version of twinkle-core is released, dependabot will create a pull request for your repository. If any breaking changes occurred in the new version, that will be described in [its changelog](https://github.com/wikimedia-gadgets/twinkle-core/blob/master/CHANGELOG.md) and in the pull request – along with notes on any code changes you may do at your end to maintain compatibility.

## Development customisation

Twinkle-starter is a rather opinionated toolkit so that you don't have to configure any development tooling, but you always tweak them. Examples: 

### Don't use TypeScript
<details>
    <summary>Click to expand</summary>

Rename all `.ts` files to `.js`. 

Remove any type specifiers and other non-JS syntax you see anywhere.

In `src/core.ts`, uncomment the line `export * from 'twinkle-core/js/src/index'` and comment out the others.

In webpack.config.json, replace `entry: './src/twinkle.ts'` with `entry: './src/twinkle.js'`

In package.json, change `"sideEffects": ["src/globals.ts"]` to `"sideEffects": ["src/globals.js"]`

Modify `eslintrc.json` file to remove `"parser": "@typescript-eslint/parser"` and `"plugins": ["@typescript-eslint"]`.

Optional cleanup steps:

Run `npm uninstall typescript tslib ts-loader ts-jest @typescript-eslint/eslint-plugin @typescript-eslint/parser`

Delete the file `tsconfig.json`
</details>

### Don't minify the files before deploying
<details>
    <summary>Click to expand</summary>
WARNING: this can result in a HUGE twinkle.js file (>1 MB).

In `webpack.prod.config.js`, flip `mode` from `production` to `development`. Please refer to the Webpack user guide for more precise configurations. 
</details>

### Remove prettier

<details>
    <summary>Click to expand</summary>
<a href="https://prettier.io">Prettier</a> is quite opinionated, it is OK to want to break free from it.

Run the command `npm uninstall prettier lint-staged husky`

Delete the files `.prettierrc` and `.prettierignore`. 

Remove the "husky" and "lint-staged" fields in `package.json`.

</details>

### Remove eslint

<details>
    <summary>Click to expand</summary>
While eslint is ubiquitous in JavaScript projects, it may not be necessary in TypeScript projects that also use Prettier. TypeScript ensures syntax sanity and Prettier ensures formatting sanity. Both these tools do their respective jobs better than eslint does either.

Run `npm uninstall eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser`

Delete any `.eslintrc.json` file(s)
</details>

### Use a source code host other than GitHub
<details>
  <summary>Click to expand</summary>

Temporarily create a GitHub repository for the template initialisation workflow. When it completes, clone the repo, after which you can delete the GitHub repo and push it to the source code hosting site of your preference.

Delete the `.github` directory - everything inside it works only on GitHub. You'll have to find your own means for any CI workflows you may want to run.

If you want to host your code on Gerrit – file a repository request at <a href="https://www.mediawiki.org/wiki/Gerrit/New_repositories/Requests">mw:Gerrit/New repositories/Requests</a>

Do check regularly for new twinkle-core releases, since dependabot wouldn't be able to automatically notify you outside GitHub.

</details>

## Troubleshooting
- Getting `JavaScript parse error (scripts need to be valid ECMAScript 5)` after deploying the output of `grunt build`:
  - This is because your wiki doesn't support ES6 for JavaScript (only supported in MW 1.42+). Please change the `target` field in `webpack.config.js` and `tsconfig.json` files from `es6` to `es5`.

## Need help?

Channels for reporting issues or seeking help include:
- [Creating an issue](https://github.com/wikimedia-gadgets/twinkle-starter/issues/new) for this repository
- Asking on the Discord server [Wikimedia-Gadgets](https://discord.gg/P9mqtjBDNb).
- Asking on [en:WT:TW](https://en.wikipedia.org/wiki/Wikipedia_talk:Twinkle) [not preferred due to clumsiness of wikitext]
- Directly [emailing the maintainer SD0001](https://en.wikipedia.org/wiki/Special:EmailUser/SD0001) 

----

Developed as part of [Grants:Project/Rapid/SD0001/Twinkle localisation](https://meta.wikimedia.org/wiki/Grants:Project/Rapid/SD0001/Twinkle_localisation).
