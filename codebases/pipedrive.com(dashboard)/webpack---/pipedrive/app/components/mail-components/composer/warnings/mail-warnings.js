const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const _ = require('lodash');
const mailWarnings = {
	getReconnectMessage: function(draftModel) {
		const lastDisconnectedAccount = MailConnections.getLastDisconnectedAccount();
		const emailAddress = lastDisconnectedAccount
			? lastDisconnectedAccount.get('email_address')
			: '';
		const warningMsg = draftModel.isNew()
			? _.gettext('Your email account %s is no longer connected.', [
					`<strong>${emailAddress}</strong>`
			  ])
			: _.gettext(
					'You can’t edit or send the draft because your email account %s is no longer connected.',
					[`<strong>${emailAddress}</strong>`]
			  );

		return `${warningMsg} ${_.gettext('%sReconnect%s or %sopen settings%s.', [
			'<a href="" data-composer="nylas-reconnect-link">',
			'</a>',
			'<a href="/settings/email-sync">',
			'</a>'
		])}`;
	},

	getMessage: function(draftModel) {
		const activeConnection = MailConnections.getConnectedNylasConnection();
		const relatedMessageIsSmartBcc =
			this.relatedMessage && !!this.relatedMessage.get('smart_bcc_flag');
		const accountChangedWarn = draftModel.isAccountMismatchResultingNewThread();
		const connectedEmail = activeConnection ? activeConnection.get('email_address') : '';

		let message;

		if (!activeConnection) {
			message = this.getReconnectMessage(draftModel);
		} else if (activeConnection.isNylasSetupIncomplete()) {
			message = _.gettext(
				'You have successfully connected your email with Pipedrive. ' +
					'Before you start sending and receiving emails, ' +
					'please select the folders/labels you want to sync %shere%s',
				['<a href="/settings/email-sync" target="_blank">', '</a>']
			);
		} else if (relatedMessageIsSmartBcc) {
			message = _.gettext(
				'This conversation has been synced with Smart BCC. A new conversation will be ' +
					'created with full-sync with: %s',
				[`<strong>${connectedEmail}</strong>`]
			);
		} else if (accountChangedWarn) {
			message = _.gettext(
				'A new conversation will be created when sending your message because this ' +
					'conversation was synced from a different email account than the one currently connected %s',
				[`<strong>${connectedEmail}</strong>`]
			);
		}

		return sanitizeHtml(message);
	}
};

module.exports = mailWarnings;
