import { Twinkle, init, loadAdditionalMediaWikiMessages, SiteConfig } from 'twinkle-core';
import messages from './messages.json';
import mwMessageList from './mw-messages';


// Check if account is experienced enough to use Twinkle
if (!Morebits.userIsInGroup('autoconfirmed') && !Morebits.userIsInGroup('confirmed')) {
	throw new Error('Twinkle: forbidden!');
}

Twinkle.userAgent = `Twinkle (${mw.config.get('wgWikiID')})`;

Twinkle.summaryAd = ' ([[Project:TW|TW]])';

Twinkle.changeTags = [];

Twinkle.messageOverrides = messages;

Twinkle.preModuleInitHooks = [
	() => loadAdditionalMediaWikiMessages(mwMessageList)
];

Twinkle.registeredModules = [
	// Add modules here
];

/**
 * Adjust the following configurations if necessary
 * Check the documentation for each property here:
 * https://twinkle.toolforge.org/core-docs/modules/siteconfig.html
 */

SiteConfig.permalinkSpecialPageName = 'Special:PermanentLink';

SiteConfig.botUsernameRegex = /bot\b/i;

SiteConfig.flaggedRevsNamespaces = [];

SiteConfig.redirectTagAliases = ['#REDIRECT'];


// Go!
init();