// Adapted from https://github.com/wikimedia-gadgets/xfdcloser/blob/master/bin/deploy.js
// (MIT Licence)
/**
 * This script is used to deploy files to the wiki.
 * You must have interface-admin rights to deploy as gadget.
 *
 * ----------------------------------------------------------------------------
 *    Set up:
 * ----------------------------------------------------------------------------
 * 1) Use [[Special:BotPasswords]] to get credentials. Make sure you enable
 *    sufficient permissions.
 * 2) Create a JSON file to store the username and password. This should be
 *    a plain JSON object with keys "username" and "password", see README
 *    file for an example. Save it here in the "scripts" directory with file
 *    name "credentials.json".
 *
 * ---------------------------------------------------------------------------
 *    Pre-deployment checklist:
 * ---------------------------------------------------------------------------
 * 1) Changes committed and merged to master branch on GitHub repo
 * 2) Currently on master branch, and synced with GitHub repo
 * 3) Run a full build using "grunt build"
 * When all of the above are done ==> you are ready to proceed with deployment
 *
 * --------------------------------------------------------------------------
 *    Usage:
 * --------------------------------------------------------------------------
 * Ensure the pre-deployment steps above are completed, unless you are only
 * deploying to the testwiki (test.wikipedia.org). Then, run this script:
 * In the terminal, enter
 *     node deploy.js
 * and supply the requested details.
 * Notes:
 * - The default summary if not specified is "Updated from repository"
 * - Edit summaries will be prepended with the version number from
 *   the package.json file
 * - Changes to gadget definitions need to be done manually
 *
 */
const fs = require('fs/promises');
const { mwn } = require('mwn');
const { execSync } = require('child_process');
const prompts = require('prompts');
const chalk = require('chalk');
const minimist = require('minimist');

// Adjust target file names if necessary
// All file paths are with respect to repository root
// Remove twinkle-pagestyles.css if deploying as user script
const deployTargets = [
	{ file: 'build/twinkle.js', target: 'MediaWiki:Gadget-TwinkleV3.js' },
	{ file: 'build/twinkle.css', target: 'MediaWiki:Gadget-TwinkleV3.css' },
	{ file: 'build/morebits.js', target: 'MediaWiki:Gadget-morebitsV3.js' },
	{
		file: 'build/morebits.css',
		target: 'MediaWiki:Gadget-morebitsV3.css',
	},
	{
		file: 'build/twinkle-pagestyles.css',
		target: 'MediaWiki:Gadget-Twinkle-pagestylesV3.css',
	},
];

class Deploy {
	async deploy() {
		if (!isGitWorkDirClean()) {
			log('red', '[WARN] Git working directory is not clean.');
		}
		const config = this.loadConfig();
		await this.getApi(config);
		await this.login();
		await this.makeEditSummary();
		await this.savePages();
	}

	loadConfig() {
		try {
			return require(__dirname + '/credentials.json');
		} catch (e) {
			log('red', 'No credentials.json file found.');
			return {};
		}
	}

	async getApi(config) {
		this.api = new mwn(config);
		try {
			this.api.initOAuth();
			this.usingOAuth = true;
		} catch (e) {
			if (!config.username) {
				config.username = await input('> Enter username');
			}
			if (!config.password) {
				config.password = await input('> Enter bot password', 'password');
			}
		}
		if (args.testwiki) {
			config.apiUrl = `https://test.wikipedia.org/w/api.php`;
		} else {
			if (!config.apiUrl) {
				if (Object.keys(config).length) {
					log('yellow', 'Tip: you can avoid this prompt by setting the apiUrl as well in credentials.json');
				}
				const site = await input('> Enter sitename (eg. en.wikipedia.org)');
				config.apiUrl = `https://${site}/w/api.php`;
			}
		}
		this.api.setOptions(config);
	}

	async login() {
		this.siteName = this.api.options.apiUrl.replace(/^https:\/\//, '').replace(/\/.*/, '');
		log('yellow', '--- Logging in ...');
		if (this.usingOAuth) {
			await this.api.getTokensAndSiteInfo();
		} else {
			await this.api.login();
		}
	}

	// TODO: read last saved commit hash and use that to construct a meaningful summary
	async makeEditSummary() {
		const sha = execSync('git rev-parse --short HEAD').toString('utf8').trim();
		const message = await input('> Edit summary message (optional): ');
		this.editSummary = `Commit ${sha}: ${message || 'Updated from repository'}`;
		console.log(`Edit summary is: "${this.editSummary}"`);
	}

	async readFile(filepath) {
		return (await fs.readFile(__dirname + '/../' + filepath)).toString();
	}

	async savePages() {
		await input(`> Press [Enter] to start deploying to ${this.siteName} or [ctrl + C] to cancel`);

		log('yellow', '--- starting deployment ---');

		for await (let { file, target } of deployTargets) {
			let fileText = await this.readFile(file);
			try {
				const response = await this.api.save(target, fileText, this.editSummary);
				if (response && response.nochange) {
					log('yellow', `━ No change saving ${file} to ${target} on ${this.siteName}`);
				} else {
					log('green', `✔ Successfully saved ${file} to ${target} on ${this.siteName}`);
				}
			} catch (error) {
				log('red', `✘ Failed to save ${file} to ${target} on ${this.siteName}`);
				logError(error);
			}
		}
		log('yellow', '--- end of deployment ---');
	}
}

function isGitWorkDirClean() {
	try {
		execSync('git diff-index --quiet HEAD --');
		return true;
	} catch (e) {
		return false;
	}
}

async function input(message, type = 'text', initial = '') {
	let name = String(Math.random());
	return (await prompts({ type, name, message, initial }))[name];
}

function logError(error) {
	error = error || {};
	console.log((error.info || 'Unknown error') + '\n', error.response || error);
}

function log(color, ...args) {
	console.log(chalk[color](...args));
}

const args = minimist(process.argv.slice(2));
new Deploy().deploy();
