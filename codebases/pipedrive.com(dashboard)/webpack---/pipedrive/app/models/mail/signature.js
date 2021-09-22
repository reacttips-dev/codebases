const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const { Model } = require('@pipedrive/webapp-core');

/**
 * Model for the v2 mail signature.
 */

const MailSignatureModel = Model.extend({
	type: 'mailSignature',
	url: '/api/v1/mailbox/mailSignature',

	initialize: function() {
		this.pull();
	},

	getParsedSignature: function() {
		const signature = this.get('html') || '';

		return signature ? sanitizeHtml(signature.replace(/\n/g, '<br/>'), { loose: true }) : '';
	}
});

module.exports = MailSignatureModel;
