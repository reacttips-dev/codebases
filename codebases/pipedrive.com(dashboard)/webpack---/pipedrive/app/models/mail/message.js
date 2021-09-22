const Pipedrive = require('pipedrive');
const _ = require('lodash');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const PartyModelsHandler = require('utils/mail/party-models-handler');
const l10n = require('l10n');
const User = require('models/user');
const moment = require('moment');
const { MergeFieldsHelpers } = require('@pipedrive/pd-wysiwyg');
const Logger = require('utils/logger');
const logger = new Logger('mail');
const browser = require('utils/browser');
/**
 * Mail message model
 *
 * @class  pages/mail/models/mail/message
 *
 * @extends {module:Pipedrive.Model}
 */
const MailMessageModel = Pipedrive.Model.extend({
	type: 'mailMessage',

	allowDirectSync: true,

	urlRoot: `${app.config.api}/mailbox/mailMessages/`,

	bodyFetchRequestOpts: {},

	fallback: {
		subject: l10n.gettext('(No Subject)')
	},

	partyModelsHandler: null,

	initialize: function() {
		this.partyModelsHandler = new PartyModelsHandler({
			to: this.get('to'),
			cc: this.get('cc'),
			bcc: this.get('bcc'),
			from: this.get('from')
		});
		this.onChange('subject', this.updateSubjectSnippet.bind(this));
		this.updateSubjectSnippet();
		this.selfUpdateFromSocket();
	},

	// set a subject snippet, parse it for draft messages
	updateSubjectSnippet: function() {
		const subject = this.get('subject');
		const isDraft = this.get('draft_flag');
		const subjectSnippet = isDraft ? MergeFieldsHelpers.humanizeFieldSyntax(subject) : subject;

		this.set('subject_snippet', subjectSnippet, { silent: true });
	},

	/**
	 * Download message body from separate url (body_url) with fetch and set it as message model body
	 * @void
	 */
	async fetchMessageBody(options = {}) {
		const url = this.get('body_url');

		if (!url) {
			return;
		}

		const loggableBodyUrl = url.split('Key-Pair-Id')[0];

		if (this.bodyUrlHasExpired(url) && !options.noRetry) {
			this.pull({
				success: () => this.fetchMessageBody({ ...options, noRetry: true })
			});

			return;
		}

		try {
			const body = await this.requestBodyWithRetry(url);

			if (!_.isString(body)) {
				logger.remote('warning', 'Message body is not string', {
					mail_message_id: this.get('id'),
					body: `${body}`,
					body_url: loggableBodyUrl,
					path: window.location.pathname,
					browser: browser.getUserWebBrowser(),
					browser_version: String(browser.getUserWebBrowserVersion()),
					browser_is_supported: String(browser.isSupportedBrowser())
				});
			}

			this.set('body', body);

			if (options && _.isFunction(options.success)) {
				options.success();
			}
		} catch (error) {
			logger.remote('error', 'Could not download messages body', {
				mail_message_id: this.get('id'),
				error: error.message,
				body_url: loggableBodyUrl,
				path: window.location.pathname,
				browser: browser.getUserWebBrowser(),
				browser_version: String(browser.getUserWebBrowserVersion()),
				browser_is_supported: String(browser.isSupportedBrowser()),
				error_obj: error
			});

			if (options && _.isFunction(options.error)) {
				options.error();
			}
		}
	},

	async requestBodyWithRetry(url) {
		const maxRetries = 5;
		const timeout = (count) => new Promise((res) => setTimeout(res, count * 1000));

		let retryCount = 0;
		let error;

		while (retryCount < maxRetries) {
			try {
				const response = await fetch(url);

				return response.text();
			} catch (caughtError) {
				error = caughtError;
				await timeout(retryCount);
				retryCount++;
			}
		}

		throw error;
	},

	bodyUrlHasExpired: function(url) {
		const match = /Expires=(\w+)/g.exec(url);
		const expireTime = _.isArray(match) ? moment.utc(match[1], 'X') : 0;

		return expireTime - moment.utc() <= 0;
	},

	isBodyFetched: function() {
		return !_.isUndefined(this.get('body'));
	},

	/**
	 * Returns an array of ids of persons (linked_person_id) in to, cc, bcc and from.
	 * @return {Array}
	 */
	getLinkedPersonIds: function() {
		const parties = this.getAllParties();
		const linkedPersonIds = [];

		_.forEach(parties, (party) => {
			if (_.isObject(party) && party.linked_person_id) {
				linkedPersonIds.push(party.linked_person_id);
			}
		});

		return linkedPersonIds;
	},

	/**
	 * Returns all message parties (to/cc/from) merged into one list
	 * @return {Array}
	 */
	getAllParties: function() {
		return _.union(this.get('to'), this.get('cc'), this.get('bcc'), this.get('from'));
	},

	/**
	 * Returns a party with the specified id, from the list of all parties of the mail message
	 * @param  {Number} partyId
	 * @return {Object}
	 */
	getPartyById: function(partyId) {
		return _.find(this.getAllParties(), { id: partyId });
	},

	/**
	 * Gets the user ID of the mail sender, if mail is linked to a user.
	 * @return {Number} ID of the user
	 */
	getSenderUserID: function() {
		return (!_.isEmpty(this.get('from')) && this.get('from')[0].user_id) || null;
	},

	/**
	 * Gets the person ID of the mail sender, if mail is linked to a person.
	 * @return {Number} ID of the person
	 */
	getSenderPersonID: function() {
		return (!_.isEmpty(this.get('from')) && this.get('from')[0].person_id) || null;
	},

	/**
	 * Get attribute used by other models to relate to this
	 * for mailMessage it is {mail_message_id: 123}
	 *
	 * @return {Object}
	 */
	getRelatedBy: function() {
		return { mail_message_id: this.get('id') };
	},

	/**
	 * To check if message would have more than one recipients to reply to after my own nylas
	 * email has taken out from there.
	 * @return {String} 'reply' or 'reply_all'
	 */
	getDefaultReplyMode: function() {
		if (!MailConnections.hasActiveNylasConnection()) {
			return 'reply';
		}

		const recipientsWithoutUserSelf = this.getRecipientsWithoutUserSelf();

		return recipientsWithoutUserSelf.length > 1 ? 'reply_all' : 'reply';
	},

	getRecipientsWithoutUserSelf: function() {
		if (!MailConnections.hasActiveNylasConnection()) {
			return;
		}

		const nylasConnection = MailConnections.getConnectedNylasConnection();
		const nylasConnectedEmail = nylasConnection.get('email_address').toLowerCase();
		const recipients = _.reject(this.getAllParties(), (recipient) => {
			return recipient.email_address.toLowerCase() === nylasConnectedEmail;
		});

		return recipients;
	},

	isUndisclosedRecipients: function() {
		return _.isEmpty(_.union(this.get('to'), this.get('cc'), this.get('bcc')));
	},

	isLinkTrackingEnabled: function() {
		const activeConnection = MailConnections.getConnectedNylasConnection();
		const isEmailTrackingEnabled = MailConnections.isEmailTrackingEnabled();
		const linkTrackingSettingEnabled =
			activeConnection &&
			isEmailTrackingEnabled &&
			activeConnection.get('mail_tracking_link_flag');

		return (
			linkTrackingSettingEnabled &&
			this.get('mail_link_tracking_enabled_flag') &&
			this.isOwnerOfMessage()
		);
	},

	isOwnerOfMessage: function() {
		return User.get('id') === this.get('user_id');
	}
});

module.exports = MailMessageModel;
