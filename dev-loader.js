/**
 * Browser-context code to load Twinkle
 *
 * http://localhost:5500/core/* resolves to the path to twinkle-core
 * are is served via webpack-dev-server's before config
 *
 * http://localhost:5500/css loads css/twinkle.css via another of
 * webbpack-dev-server before configs
 *
 * http://localhost:5500/twinkle.js is served in-memory
 * via webpack-dev-server
 *
 * Ensure that no twinkle gadget on-wiki is enabled, as it
 * could conflict.
 *
 */

mw.loader.using([
	'mediawiki.api', 'mediawiki.Title', 'mediawiki.user', 'mediawiki.util',
	'mediawiki.libs.pluralruleparser', 'es6-promise'
]).then(function() {
	mw.loader.getScript('http://localhost:5500/core/morebits/morebits.js').then(function () {
		mw.loader.getScript('http://localhost:5500/twinkle.js');
	});
});

// Lazy load
mw.loader.load('jquery.ui');
mw.loader.getScript('http://localhost:5500/core/lib/select2.min.js');
mw.loader.load('http://localhost:5500/css', 'text/css');
mw.loader.load('http://localhost:5500/core/lib/select2.min.css', 'text/css');
mw.loader.load('http://localhost:5500/core/morebits/morebits.css', 'text/css');
