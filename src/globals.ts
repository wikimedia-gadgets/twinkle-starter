/**
 * Allow global access for certain objects for debugging and console-based testing
 */

import { msg, Twinkle, registerModule, Api, Page } from './core';

// @ts-ignore
window.Twinkle = Twinkle;

$.extend(Twinkle, {
	registerModule,
	msg,
	Page,
	Api,
});

// Make jQuery Deferred exceptions hit the source map during debugging
// @ts-ignore
if (typeof __webpack_exports__ !== 'undefined') {
	jQuery.Deferred.exceptionHook = function (err) {
		throw err;
	};
}
