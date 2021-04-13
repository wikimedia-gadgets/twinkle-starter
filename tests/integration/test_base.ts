export const fs = require('fs');
export const { mwn } = require('mwn');

// External API clients to make and observe changes
let mwnConfig = {
	apiUrl: 'http://localhost:8080/api.php',
	password: '12345678901234567890123456789012', // BotPassword configured in setup.sh
};

export const bot = new mwn({ ...mwnConfig, username: 'Wikiuser@bp' });
export const bot2 = new mwn({ ...mwnConfig, username: 'Wikiuser2@bp' });

export function setupMwn() {
	// Don't login again if already logged in (from another file)
	if (!bot.loggedIn) {
		// Login the 1st account. The 2nd account needs to sign in only if required
		return bot.login();
	}
}

export async function setupMWBrowser(page) {
	await page.goto('http://localhost:8080/index.php?title=Special:UserLogin');
	await page.fill('#wpName1', 'Wikiuser');
	await page.fill('#wpPassword1', 'wikipassword');
	await Promise.all([
		page.click('#wpLoginAttempt'), // Clicking the link will cause a navigation
		page.waitForNavigation(), // The promise resolves after navigation has finished
	]);
}

declare global {
	namespace jest {
		interface Matchers<R, T = {}> extends Chai.LanguageChains {}
	}
}

export async function loadExpectInBrowser() {
	// Also load expect in the browser context so that we can make expect assertions in browser context too
	// However, note that these if these fail, no meaningful logging error messages may be displayed in the
	// console. Due to this, minimise use of browser context assertions as far as possible.
	await page.evaluate(() => {
		return $.getScript('https://cdnjs.cloudflare.com/ajax/libs/expect/1.20.2/expect.min.js');
	});
}

async function readFile(path) {
	return (await fs.promises.readFile(path)).toString();
}

export async function loadTwinkle() {
	const twinkleCore = __dirname + '/../../../twinkle-core/';
	const repoRoot = __dirname + '/../../';

	await page.evaluate(() => {
		return mw.loader.using(['jquery.ui']);
	});
	// we can do without the css peer gadget
	await page.addStyleTag({
		content:
			(await readFile(twinkleCore + 'morebits/morebits.css')) + '\n' + (await readFile(repoRoot + 'src/twinkle.css')),
	});
	await page.evaluate(await readFile(twinkleCore + 'morebits/morebits.js'));
	await page.evaluate(await readFile(repoRoot + 'build/twinkle.js'));
}

export class TwinkleModule {
	moduleName: string;
	constructor(moduleName) {
		this.moduleName = moduleName;
	}
	async open(load = true) {
		if (load) {
			await loadTwinkle();
		}

		// Open the TW menu by checking the virtual checkbox
		await page.check('.vector-menu-checkbox[aria-labelledby="p-twinkle-label"]');
		// Click menu item
		await page.click(`#twinkle-${this.moduleName}`);
		return this;
	}
	async submit() {
		// Assumes only one quickForm is open at a time
		await page.click('.morebits-dialog-buttons button');
		await page.waitForSelector('.morebits_action_complete');
	}
}

export async function createRandomPage(prefix, content?, summary?) {
	const pageName = prefix + '/' + rand();
	await bot.create(pageName, content || 'Test page', summary);
	return pageName;
}

export async function goto(pageName: string) {
	if (pageName.startsWith('?')) {
		await page.goto('http://localhost:8080/index.php' + pageName);
	} else if (pageName.startsWith('/')) {
		// path provided
		await page.goto('http://localhost:8080/index.php/wiki' + pageName);
	} else {
		await page.goto('http://localhost:8080/index.php/' + mwn.util.wikiUrlencode(pageName));
	}
}

export async function createAndGotoRandomPage(prefix, content?, summary?) {
	const pageName = await createRandomPage(prefix, content, summary);
	await goto(pageName);
	return pageName;
}

export function rand(digits = 5) {
	return String(Math.random()).slice(2, 2 + digits);
}

export async function readText(pageName) {
	return (await bot.read(pageName)).revisions[0].content;
}
