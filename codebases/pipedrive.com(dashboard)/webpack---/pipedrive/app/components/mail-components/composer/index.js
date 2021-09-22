'use strict';
const _ = require('lodash');
/**
 * Creates a mail composer factory, that is used to create mail composers based on type.
 * Available types: 'reply-forward', 'new-mail'.
 *
 * @class  components/MailComposer
 *
 * @example
 * // In your view, create a reply-forward composer view class this way:
 * var ComposerComponent = require('components/mail-composer/index'),
 *     ReplyForwardComposer = ComposerComponent.getComposer('reply-forward');
 *
 * // And then the instance:
 * this.replyForwardComposer = new ReplyForwardComposer(options);
 */
const ComposerSelector = function() {
	_.assignIn(
		this,
		/** @lends components/MailComposer.prototype */ {
			/**
			 * Accepted composer types and respective views.
			 * @type {Object}
			 */
			composers: {
				'reply-forward': require('./views/composers/reply-forward'),
				'new-mail': require('./views/composers/new-mail')
			}
		}
	);
};

/**
 * Creates a mail composers based on type.
 *
 * @param {String} type 	The type of the composer to be created
 * @return {module:Pipedrive.View}
 */
ComposerSelector.prototype.getComposer = function(type) {
	let Composer;

	if (this.composers.hasOwnProperty(type)) {
		Composer = this.composers[type];
	} else {
		throw new Error(`Failed to create new composer. Unknown type: ${type}`);
	}

	return Composer;
};

module.exports = new ComposerSelector();
