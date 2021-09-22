const User = require('models/user');
const _ = require('lodash');
const SmartBccUtils = function() {};

_.assignIn(SmartBccUtils.prototype, {
	/**
	 * Used when the user sends the test-email via the default mail client.
	 * @return {String} Returns the content of the test-email
	 */
	getTestEmailLinkHrefValue: function() {
		const bccEmail = User.get('cc_email');
		const subject = _.gettext('The Pipedrive Mail page test email');
		const body = this.generateBodyString();

		return encodeURI(`mailto:?bcc=${_.escape(bccEmail)}&subject=${subject}&body=${body}`);
	},

	generateBodyString: function() {
		const string = `${_.gettext('Hi')},\n\r${
			/* eslint-disable max-len */
			_.gettext(
				'Send this email to yourself or a colleague to see how emails get copied into Pipedrive, using our smart email BCC address. You’ll see the email in your Pipedrive Mail page shortly. Here’s how we handle emails'
			)
		}:\n\r- ${_.gettext(
			'Pipedrive will create a new contact automatically if no contact already exists with such an email address'
		)}.\n\r- ${_.gettext(
			'There’s a setting that allows you to link emails to deals automatically. If enabled, the system will look for an open deal with the person the email was sent to. If only 1 open deal is found with the person, we will link the email to the deal automatically. If we can’t determine which deal to link to or the automatic linking is disabled you can link the email to any existing deal or create a new deal with one click'
		)}.\n\r${_.gettext('Happy closing')},\n\r${_.gettext('The people at Pipedrive')}`;
		/* eslint-enable max-len */

		return string;
	}
});

module.exports = new SmartBccUtils();
