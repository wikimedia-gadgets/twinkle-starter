import { Twinkle } from 'twinkle-core';

// Make jQuery Deferred exceptions hit the source map during debugging
// XXX: there has to be a better way to do this ...
// @ts-ignore
if (typeof __webpack_exports__ !== 'undefined') {
	jQuery.Deferred.exceptionHook = function (err) {
		throw err;
	};
}

// Check if account is experienced enough to use Twinkle
if (!Morebits.userIsInGroup('autoconfirmed') && !Morebits.userIsInGroup('confirmed')) {
	throw new Error('Twinkle: forbidden!');
}

Twinkle.userAgent = 'Twinkle ([[w:en:WP:TW]])';
Twinkle.changeTags = 'twinkle';
Twinkle.summaryAd = ' ([[WP:TW|TW]])';

Twinkle.init();

Twinkle.registeredModules = [
	// Add modules here
];

for (let module of Twinkle.registeredModules) {
	Twinkle.addInitCallback(() => new module(), module.moduleName);
}

// allow global access
declare global {
	interface Window {
		Twinkle: typeof Twinkle;
	}
}
window.Twinkle = Twinkle;
