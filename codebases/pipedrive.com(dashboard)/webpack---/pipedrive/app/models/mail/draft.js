const Pipedrive = require('pipedrive');
const _ = require('lodash');
const MessageModel = require('models/mail/message');
const AttachmentsCollection = require('collections/mail/draft-attachments');
const User = require('models/user');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const logger = new Pipedrive.Logger('mail', 'draft-message-model');
const defaultRecipients = {
	to: [],
	cc: [],
	bcc: []
};

/**
 * Draft message model
 *
 * @class  models/mail/draft
 *
 * @extends {module:MailMessageModel.Model}
 */
module.exports = Pipedrive.Model.extend({
	type: 'mailDraft',

	allowDirectSync: true,

	urlRoot: `${app.config.api}/mailbox/mailDrafts/`,

	/**
	 * The message that the draft is contained by
	 * @type {module:Pipedrive.Model}
	 */
	messageModel: null,

	/**
	 * The thread that the draft is contained by
	 * @type {module:Pipedrive.Model}
	 */
	threadModel: null,

	relatedMessage: null,

	recipients: null,

	sendmode: null,

	sending: false,

	recentlyAddedRecipients: null,

	initialize: function(draftAttrs, options) {
		this.options = options || {};
		this.recentlyAddedRecipients = [];

		if (this.options.messageAttrs) {
			this.messageAttrsIntoDraftModel(options.messageAttrs);
		}

		this.sendmode = this.get('sendmode');
		this.recipients = _.clone(defaultRecipients);
		this.relatedMessage = this.options.relatedMessage || {};

		if (this.isNew()) {
			this.appendSignatureToBody();
		}

		this.initRecipients();
	},

	onSyncSuccess: function(callbackOpts, response, statusText, xhr) {
		this.setMessageModel(response.data);

		// If triggered on delete or send
		if (callbackOpts.method === 'delete' || response.data.sent_flag) {
			response.data = {};
			// If just saving
		} else {
			response.data = this.combDraftAttrs(response.data);
		}

		Pipedrive.Model.prototype.onSyncSuccess.call(this, callbackOpts, response, statusText, xhr);
	},

	/**
	 * We don't actually trigger sync evets for the draft model itself, but for the related models -
	 * mail-message and thread models.
	 *
	 * @param  {String} draftEventType 	"add", "update" or "delete"
	 * @void
	 */
	triggerSyncEvent: function(draftEventType) {
		this.updateThreadModel(draftEventType);
		this.triggerSyncEventsForRelatedModels(draftEventType);
	},

	save: function(data, options) {
		options = options || {};

		const extendedOptions = _.assignIn({}, options, {
			error: this.onSaveError.bind(this, options)
		});

		Pipedrive.Model.prototype.save.call(this, data, extendedOptions);
	},

	onSaveError: function(options, model, response, requestOptions) {
		if (_.isFunction(options.error)) {
			options.error(model, response, requestOptions);
		}
	},

	/**
	 * Get draft-s sendmode
	 *
	 * @return {String}
	 */
	getSendmode: function() {
		return this.sendmode;
	},

	/**
	 * Part of mock-thread-for-local-syncing logic.
	 * To keep the ui up-to-date before the real sockets come in after user interacts with the draft,
	 * we create or update the related thread model based on the data in the draft model.
	 *
	 * @param  {String} draftEventType
	 * @void
	 */
	updateThreadModel: function(draftEventType) {
		const threadData = this.combineThreadDataFromDraft(draftEventType);
		const threadId = this.threadModel.get('id') || threadData.id;

		logger.log(`Adding / updating thread ${threadId} with data:`, threadData);

		this.threadModel.set(threadData);
	},

	setRecentlyAddedRecipients: function(recipient) {
		this.recentlyAddedRecipients.push(recipient);
	},

	getRecentlyAddedRecipients: function() {
		return this.recentlyAddedRecipients;
	},

	getInvalidRecipients: function() {
		let invalidRecipients = [];

		_.forIn(this.getSyncedRecipients(), function(values) {
			invalidRecipients = invalidRecipients.concat(
				_.filter(values, function(recipient) {
					return recipient.valid_flag === false;
				})
			);
		});

		return invalidRecipients;
	},

	containsInvalidRecipient: function(recipient) {
		return !_.isEmpty(
			_.filter(this.getRecentlyAddedRecipients(), function(added) {
				return added.id === recipient.email_address;
			})
		);
	},

	getInvalidAddedRecipients: function() {
		const invalidRecipients = this.getInvalidRecipients();
		const invalidAddedRecipients = _.filter(
			invalidRecipients,
			_.bind(function(recipient) {
				return this.containsInvalidRecipient(recipient);
			}, this)
		);

		return invalidAddedRecipients;
	},

	setSendmode: function(mode) {
		this.sendmode = mode;
	},

	getSignature: function() {
		const parsedSignature = User.settings.mailSignature.getParsedSignature();

		let signature;

		if (!_.isEmpty(parsedSignature)) {
			signature = `<br/><br/><div data-pipedrivesignature><div>${parsedSignature}</div></div>`;
		}

		return signature;
	},

	appendSignatureToBody: function() {
		const signatureString = this.getSignature();

		if (!signatureString) {
			return;
		}

		const oldBody = this.get('body') || '';

		const newBody = oldBody.concat(signatureString);

		this.set({
			body: newBody
		});
	},

	hasPresetRecipients: function() {
		return (
			!_.isEmpty(this.get('to')) || !_.isEmpty(this.get('bcc')) || !_.isEmpty(this.get('cc'))
		);
	},

	/**
	 * Figure out who to send the mail to
	 */
	initRecipients: function() {
		if (!this.isNew() || this.hasPresetRecipients()) {
			this.setRecipientsFromModelAttributes();
		} else {
			this.setRecipientsBySendmode();
		}
	},

	setRecipientsBySendmode: function(clear) {
		const sendmode = this.getSendmode();

		if (clear) {
			this.clearRecipients();
		}

		if (sendmode === 'reply') {
			this.setReplyRecipients();
		} else if (sendmode === 'reply_all') {
			this.setReplyAllRecipients();
		}
	},

	/**
	 * Get recipient field value
	 *
	 * @param {String} fieldName 	Key to get from this.recipients object
	 * @return {Array}
	 */
	getRecipientsField: function(fieldName) {
		if (!_.has(defaultRecipients, fieldName)) {
			return;
		}

		const fieldRecipients = this.recipients[fieldName] || [];

		return _.uniqBy(fieldRecipients, 'email_address');
	},

	/**
	 * Set recipient field value
	 *
	 * @param {string} key to be set in this.recipients object
	 * @param {array} array of recipient objects with emails
	 * @return {array}
	 */
	setRecipientsField: function(fieldName, recipientsArr) {
		if (!_.isArray(recipientsArr) || !_.has(defaultRecipients, fieldName)) {
			return;
		}

		this.recipients[fieldName] = recipientsArr;

		return this.getRecipientsField(fieldName);
	},

	/**
	 * Add recipient field value
	 *
	 * @param {string} key value to be modified
	 * @param {array} array of recipient objects with emails
	 * @return {array}
	 */
	addRecipients: function(fieldName, recipientsArr) {
		if (!_.isArray(recipientsArr) || !_.has(defaultRecipients, fieldName)) {
			return;
		}

		const recipientsField = this.getRecipientsField(fieldName);

		if (recipientsField.length > 0) {
			recipientsArr = _.union(recipientsField, recipientsArr);
		}

		const recipientsWithoutLinkedPerson = _.filter(recipientsArr, function(recipient) {
			return !recipient.linked_person_id;
		});
		const recipientsWithLinkedPerson = _.filter(recipientsArr, function(recipient) {
			return recipient.linked_person_id;
		});

		// filter out duplications. It takes recipientsWithLinkedPerson first so it could
		// filter those wihtout linked person just by checking the linked_person_id

		recipientsArr = _.unionWith(
			recipientsWithLinkedPerson,
			recipientsWithoutLinkedPerson,
			function(recipient1, recipient2) {
				// if emails are the same
				return (
					recipient1.email_address === recipient2.email_address &&
					// and in the comparing recipient no linked person
					(!recipient1.linked_person_id || // or the linked person is the same
						recipient1.linked_person_id === recipient2.linked_person_id)
				);
			}
		);

		return this.setRecipientsField(fieldName, recipientsArr);
	},

	/**
	 * Adds all recipients to class coming from 'to', 'cc' and 'bcc'
	 * @void
	 */
	setRecipientsFromModelAttributes: function() {
		this.addRecipients('to', this.get('to'));
		this.addRecipients('cc', this.get('cc'));
		this.addRecipients('bcc', this.get('bcc'));
	},

	/**
	 * Add recipient from 'from' ot 'to', depending if given message was sent one
	 * @void
	 */
	setReplyRecipients: function() {
		if (this.relatedMessage.get('sent_flag')) {
			this.addRecipients('to', this.relatedMessage.get('to'));
		} else {
			this.addRecipients('to', this.relatedMessage.get('from'));
		}
	},

	/**
	 * On reply_all add recipients only from messages 'from', 'to' and 'cc'
	 * @void
	 */
	setReplyAllRecipients: function() {
		if (this.relatedMessage.get('sent_flag')) {
			this.addRecipients('to', this.relatedMessage.get('to'));
		} else {
			this.addRecipients('to', this.relatedMessage.get('from'));
			this.addRecipients('cc', this.relatedMessage.get('to'));
		}

		this.addRecipients('cc', this.relatedMessage.get('cc'));

		this.removeMyEmailAsRecipient();
	},

	/**
	 * Remove email connected with nylas from recipients only if not jet saved draft
	 * @void
	 */
	removeMyEmailAsRecipient: function() {
		const myNylasEmail = MailConnections.getConnectedNylasEmail();

		this.removeRecipient('to', myNylasEmail);
		this.removeRecipient('cc', myNylasEmail);
	},

	/**
	 * Remove recipient from field value array
	 *
	 * @param {String} fieldName 	value to be modified
	 * @param {String} email 		to be removed from field array
	 * @return {Array}
	 */
	removeRecipient: function(fieldName, email) {
		if (!_.isString(email) || !_.has(this.getRecipients(), fieldName)) {
			return;
		}

		const recipientsField = this.getRecipientsField(fieldName);

		if (recipientsField.length) {
			return this.setRecipientsField(
				fieldName,
				_.filter(recipientsField, function(o) {
					return o.email_address !== email;
				})
			);
		} else {
			return recipientsField;
		}
	},

	moveRecipient: function(email, originalField, destinationField, preventRemove) {
		const recipients = this.getRecipientsField(originalField);
		const recipient = _.find(recipients, { email_address: email });

		if (!preventRemove) {
			this.removeRecipient(originalField, email);
		}

		this.addRecipients(destinationField, [recipient]);
	},

	clearRecipients: function() {
		this.recipients = _.clone(defaultRecipients);

		return this.recipients;
	},

	getSyncedRecipients: function() {
		return {
			to: this.get('to'),
			cc: this.get('cc'),
			bcc: this.get('bcc')
		};
	},

	getRecipients: function() {
		return this.recipients;
	},

	clearRecentlyAddedRecipients: function() {
		this.recentlyAddedRecipients = [];
	},

	/**
	 * Part of mock-thread-for-local-syncing logic.
	 * Uses as much data of the draft to update the related thread model locally.
	 *
	 * @param  {String} draftEventType 	"add", "update" or "delete"
	 * @return {Object}
	 */
	combineThreadDataFromDraft: function(draftEventType) {
		const nylasAccount = MailConnections.getConnectedNylasConnection();
		const hasNewAccount = nylasAccount.get('account_id') !== this.threadModel.get('account_id');
		const draftDeleted = draftEventType === 'delete';

		let threadData = {
			folders: this.getThreadFolders(draftEventType),
			has_draft_flag: !draftDeleted,
			write_flag: true,
			snippet_draft: this.messageModel.get('snippet'),
			drafts_parties: {
				to: this.get('to'),
				cc: this.get('cc'),
				bcc: this.get('bcc'),
				from: []
			}
		};

		if (this.threadModel.isNew()) {
			threadData = _.assignIn(threadData, {
				account_id: MailConnections.getConnectedNylasConnection().get('account_id'),
				id: this.messageModel.get('mail_thread_id'),
				user_id: this.messageModel.get('user_id'),
				read_flag: true,
				archived_flag: false,
				last_message_timestamp: this.messageModel.get('add_time'),
				add_time: this.messageModel.get('add_time')
			});
		} else if (this.isSent()) {
			threadData = _.assignIn(threadData, {
				has_draft_flag: false,
				has_sent_flag: true,
				last_message_sent_timestamp: this.messageModel.get('update_time'),
				last_message_timestamp: this.messageModel.get('update_time')
			});

			if (hasNewAccount) {
				threadData = _.assignIn(threadData, {
					folders: _.without(this.threadModel.get('folders'), 'drafts'),
					has_sent_flag: this.threadModel.get('has_sent_flag')
				});

				delete threadData.last_message_sent_timestamp;
				delete threadData.last_message_timestamp;
			}
		}

		if (!this.threadModel.get('message_count')) {
			threadData = _.assignIn(threadData, {
				deleted_flag: draftDeleted,
				parties: {
					to: this.get('to'),
					cc: this.get('cc'),
					bcc: this.get('bcc'),
					from: [
						{
							email_address: User.get('email'),
							name: User.get('name')
						}
					]
				},
				subject: this.get('subject')
			});
		}

		if (this.get('deal_id')) {
			threadData.deal_id = this.get('deal_id');
		}

		return threadData;
	},

	/**
	 * Part of mock-thread-for-local-syncing logic.
	 *
	 * @param  {String} draftEventType 	"add", "update" or "delete"
	 * @return {Array}
	 */
	getThreadFolders: function(draftEventType) {
		let folders = this.threadModel.get('folders') || [];

		if (draftEventType === 'delete' || this.isSent()) {
			folders = _.without(folders, 'drafts');
		} else {
			folders = _.uniq(_.concat(folders, ['drafts']));
		}

		if (this.isSent()) {
			folders = _.uniq(
				_.concat(folders, this.threadModel.get('message_count') ? ['sent'] : [])
			);
		}

		return folders;
	},

	isSent: function() {
		return !!(this.get('meta') && this.get('meta').send);
	},

	triggerSyncEventsForRelatedModels: function(draftEventType) {
		const threadId = this.messageModel.get('mail_thread_id');
		const threadEventType = this.getThreadEventType(draftEventType);
		const threadEventName = `mailThread.model.${threadId}.${threadEventType}`;
		const threadEventData = threadEventType === 'delete' ? threadId : _.clone(this.threadModel);

		app.global.fire(threadEventName, threadEventData);

		const messageId = this.messageModel.get('id');
		const messageEventName = `mailMessage.model.${messageId}.${draftEventType}`;
		const messageEventData = draftEventType === 'delete' ? messageId : this.messageModel;

		app.global.fire(messageEventName, messageEventData);
	},

	/**
	 * If a draft gets added (created) or deleted, doesn't always mean that the thread gets created or deleted.
	 * @param  {String} draftEventType 	"add", "update" or "delete"
	 * @return {String}					"add", "update" or "delete"
	 */
	getThreadEventType: function(draftEventType) {
		let threadEventType;

		const threadMessageCount = this.threadModel.get('message_count');

		if (_.includes(['add', 'delete'], draftEventType) && threadMessageCount) {
			threadEventType = 'update';
		} else {
			threadEventType = draftEventType;
		}

		return threadEventType;
	},

	/**
	 * (This logic should get moved back to the composer or something.)
	 *
	 * @param  {Object} options 	Send options passed in
	 * @void
	 */
	send: function(data, options) {
		this.unset('meta');
		this.unset('delay_until_time');
		this.unset('priority_type');

		data.meta = { send: true };
		this.isSending(true);

		this.save(data, {
			success: this.onSendSuccess.bind(this, options),
			error: this.onSendError.bind(this, options)
		});
	},

	isSending: function(bool) {
		if (!_.isUndefined(bool)) {
			this.sending = bool;
		}

		return this.sending;
	},

	onSendSuccess: function(options, draftModel, response, requestOptions) {
		this.isSending(false);
		const sendSuccessful = draftModel.messageModel.get('sent_flag') !== 0;
		const isMailMessageInQueue = draftModel.messageModel.get('in_queue');

		// check if mail was sent or being sent out besides save
		if (!isMailMessageInQueue && !sendSuccessful) {
			this.onSendError(options, draftModel, response, requestOptions);

			return;
		}

		this.trigger('sent', draftModel);

		if (_.isFunction(options.success)) {
			options.success(draftModel);
		}
	},

	onSendError: function(options, draftModel, response, requestOptions) {
		this.isSending(false);

		if (_.isFunction(options.error)) {
			options.error(draftModel, response, requestOptions);
		}
	},

	cleanResponseForLogging: function(requestOptions) {
		const cleanedRequestOptions = _.cloneDeep(requestOptions);
		const parsedData = requestOptions.data && JSON.parse(requestOptions.data);
		const responseDraft = _.get(requestOptions, 'xhr.responseJSON.draft');

		if (parsedData && parsedData.body) {
			parsedData.body = '(body removed)';
			cleanedRequestOptions.data = JSON.stringify(parsedData);
		}

		if (responseDraft) {
			cleanedRequestOptions.xhr.responseJSON.draft = '(draft removed)';
		}

		return cleanedRequestOptions;
	},

	setAttachmentCollection: function(models) {
		const opts = {
			mailMessageId: this.isNew() ? null : this.get('id')
		};

		this.attachmentCollection = new AttachmentsCollection(models || null, opts);

		return this.attachmentCollection;
	},

	getAttachmentCollection: function() {
		if (!this.attachmentCollection) {
			this.setAttachmentCollection();
		}

		return this.attachmentCollection;
	},

	getRelatedBy: function() {
		// Draft model's id === it's containing message model's id
		return { mail_message_id: this.get('id') };
	},

	/**
	 * On server side, draft's data is stored in message model's "draft" attribute, stringified.
	 * This method extracts draft's data from the message's data, fills the current draft with it
	 * and attaches the message model to this draft model.
	 *
	 * @param  {Object} messageAttrs 	Attributes of the message that contains the draft's data
	 * @void
	 */
	messageAttrsIntoDraftModel: function(messageAttrs) {
		const draftAttrs = this.combDraftAttrs(messageAttrs);

		this.set(draftAttrs);
		this.setMessageModel(messageAttrs);
	},

	setMessageModel: function(messageAttrs) {
		if (this.messageModel) {
			this.messageModel.set(messageAttrs);
		} else {
			this.messageModel = new MessageModel(messageAttrs);
		}
	},

	setRelatedMessage: function(relatedMessage) {
		this.relatedMessage = relatedMessage;
	},

	combDraftAttrs: function(messageAttrs) {
		const draftAttrs = JSON.parse(messageAttrs.draft);

		draftAttrs.body = draftAttrs.body.formatted;
		draftAttrs.id = messageAttrs.id;
		draftAttrs.mail_thread_id = messageAttrs.mail_thread_id;

		return draftAttrs;
	},

	setDraftModel: function() {
		return this;
	},

	setThreadModel: function(threadModel) {
		this.threadModel = threadModel;
		this.threadModel.draftModel = this.setDraftModel();
	},

	isAccountMismatchResultingNewThread: function() {
		const nylasConnection = MailConnections.getConnectedNylasConnection();
		const threadConnection = MailConnections.getUserMailConnection(
			this.threadModel.get('account_id')
		);
		const isSavedNewThreadDraft = !this.isNew() && this.getSendmode() === 'new';
		const isReplyForwardDraft = this.getSendmode() !== 'new';
		const mailsCollection = this.threadModel.getMailsCollection();

		if (nylasConnection && threadConnection && (isSavedNewThreadDraft || isReplyForwardDraft)) {
			const sameEmailAddress =
				threadConnection.get('email_address') !== nylasConnection.get('email_address');
			// this is a edge case where we are unable to migrate Nylas threads over to Pipemailer if
			// the only messages in thread are sent from PD due to invalid MUA message IDs
			const differentAccountIdsWithOnlyPDSentMessages =
				threadConnection.get('account_id') !== nylasConnection.get('account_id') &&
				mailsCollection &&
				mailsCollection.hasOnlyMessagesSentFromPD();

			return sameEmailAddress || differentAccountIdsWithOnlyPDSentMessages;
		}

		return false;
	}
});
