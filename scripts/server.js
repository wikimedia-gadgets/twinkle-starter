const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server/lib/Server');
const webpackConfig = require('../webpack.config');

// See https://webpack.js.org/api/webpack-dev-server/#start

const compiler = Webpack(webpackConfig);
const devServerOptions = Object.assign({}, webpackConfig.devServer, {open: true});
const server = new WebpackDevServer(devServerOptions, compiler);

server.start().then(() => {
	console.log('Starting server on http://localhost:5500');
});

const GADGET_NAME = 'Twinkle';

// Disable the deployed gadget version when we begin our testing,
// enable it back again when we stop testing.
// You need to create a credentials.json file in this directory
// (it will be git-ignored) with the "apiUrl", "username" and "password" fields.
// See README file in this directory for more details.
(async () => {
	const { mwn } = require('mwn');
	let user;
	try {
		user = await mwn.init(__dirname + '/credentials.json');
		user.setOptions({ silent: true });
	} catch (e) {
		if (e instanceof mwn.Error) {
			console.log(`[mwn]: can't disable twinkle as gadget: login failure: ${e}`);
			console.log(e.stack);
		}
		return;
	}
	await user.saveOption('gadget-' + GADGET_NAME, '0').then(() => {
		console.log('[i] Disabled twinkle as gadget.');
	});

	// Allow async operations in exit hook
	process.stdin.resume();

	// Catch ^C
	process.on('SIGINT', async () => {
		try {
			await user.saveOption('gadget-' + GADGET_NAME, '1');
			console.log('[i] Re-enabled twinkle as gadget.');
		} catch (e) {
			console.log(`[i] failed to re-enable twinkle gadget: ${e}`);
			console.log(e.stack);
		} finally {
			process.exit();
		}
	});
})();
