const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const Pipedrive = require('pipedrive');
const _ = require('lodash');
const MailModel = require('models/mail/message');
const DraftModel = require('models/mail/draft');
const moment = require('moment');
const logger = new Pipedrive.Logger('mail', 'messages-collection');

/**
 * Collection of emails in a thread
 */
module.exports = Pipedrive.Collection.extend({
	type: 'mailMessage',

	model: MailModel,

	/**
	 * Also, see methods "setDraftModel", "getDraft", "onDraftModelDestroy" in this current class / collection.
	 * @type {module:Pipedrive.Model} 	or null
	 */
	draftModel: null,

	url: function() {
		return `${app.config.api}/mailbox/mailThreads/${this.threadId}/mailMessages`;
	},

	/**
	 * Extends the core Pipedrive collection's method "parse" with some mails based functionality.
	 * @param  {Object} response 	Response data from the API
	 * @return {Array}          	List of objects containing attributes of the models put into the collection
	 */
	parse: function(response) {
		let responseData = Pipedrive.Collection.prototype.parse.call(this, response);

		responseData = this.extractDraft(responseData);

		return responseData;
	},

	comparator: function(a, b) {
		return moment(a.get('message_time')) - moment(b.get('message_time'));
	},

	initialize: function(models, opts) {
		this.options = opts;
		this.threadId = opts && opts.threadId;
		this.bindEvents();
	},

	bindEvents: function() {
		app.global.bind('mailMessage.model.*.add', this.addMessage, this);
		app.global.bind('mailMessage.model.*.update', this.addMessage, this);
		app.global.bind('mailMessage.model.*.delete', this.removeMessage, this);
	},

	/**
	 * Adds the mail message model to the collection if the model is valid.
	 *
	 * @private
	 *
	 * @param {module:Pipedrive.Model} mailModel
	 */
	addMessage: function(mailModel) {
		if (!this.toAddMessage(mailModel)) {
			if (mailModel.get('draft_flag')) {
				this.updateDraft(mailModel);
			} else if (mailModel.get('sent_flag')) {
				this.removeDraftModel();
			}

			return;
		}

		logger.log('Adding mail message', mailModel.get('id'));

		this.add(mailModel);
	},

	updateDraft: function(mailModel) {
		const hasSameDraft = this.draftModel && this.draftModel.get('id') === mailModel.get('id');
		const belongsToThread = mailModel.get('mail_thread_id') === Number(this.threadId);

		if (!hasSameDraft && belongsToThread) {
			const draftModel = new DraftModel(null, { messageAttrs: mailModel.attributes });

			this.setDraftModel(draftModel, true);
		}
	},

	toAddMessage: function(mailModel) {
		const belongsToThread = mailModel.get('mail_thread_id') === Number(this.threadId);
		const alreadyInCollection = this.where({ id: mailModel.get('id') }).length > 0;

		// The messages that are still drafts are not synced yet. We don't want to add them to the "real" messages yet.

		const isSynced = mailModel.get('synced_flag');
		const isDeleted = mailModel.get('deleted_flag');

		return isSynced && belongsToThread && !alreadyInCollection && !isDeleted;
	},

	removeMessage: function(messageId) {
		const message = this.find({ id: messageId });

		if (this.draftModel && this.draftModel.get('id') === messageId) {
			this.draftModel = null;
		}

		if (message) {
			logger.log('Removing message', messageId);
			this.remove(message);
		}
	},

	extractScheduledMailData: function(mailCollections) {
		return _.reduce(
			mailCollections,
			(modifiedCollection, mail) => {
				if (_.isEmpty(mail.from)) {
					const draftContent = JSON.parse(mail.draft);

					modifiedCollection.push({
						...mail,
						to: draftContent.to,
						from: modifiedCollection[0].from,
						snippet: sanitizeHtml(draftContent.body.formatted)
					});
				} else {
					modifiedCollection.push(mail);
				}

				return modifiedCollection;
			},
			[]
		);
	},

	/**
	 * Extracts the draft model (if there is one) out of the API response data and assigns it to the collection,
	 * but not inside the collection.
	 *
	 * @param  {Array} responseData		List of objects containing attributes of the models put into the collection
	 * @return {Array}
	 */
	extractDraft: function(responseData) {
		const isScheduledMail = responseData.find((mail) => !_.isEmpty(mail.mail_queue));

		if (isScheduledMail) {
			return this.extractScheduledMailData(responseData);
		} else {
			const messageWithDraftData = _.remove(responseData, { draft_flag: 1 })[0];

			let draftModel;

			if (messageWithDraftData) {
				draftModel = new DraftModel(null, { messageAttrs: messageWithDraftData });
				this.setDraftModel(draftModel);
			}

			return responseData;
		}
	},

	/**
	 * We assign the draft model to the collection as a property of the collection, not into the
	 * message models array, because we don't want the collection view to render the draft as if
	 * it was a regular message.
	 * If a draft is already assigned to the collection, updates it's data.
	 *
	 * @param {module:Pipedrive.Model} newDraftModel
	 * @void
	 */
	setDraftModel: function(newDraftModel, triggerEvent) {
		if (this.draftModel && !this.draftModel.isNew() && !newDraftModel.isNew()) {
			logger.warn('Prevented overriding the existing draft model!');

			return;
		}

		this.draftModel = newDraftModel;
		this.listenTo(this.draftModel, 'sent', this.onDraftModelSent);
		this.listenTo(this.draftModel, 'destroy', this.onDraftModelDestroy);

		if (triggerEvent) {
			this.trigger('draftAdded', this.draftModel);
		}
	},

	getDraft: function() {
		return this.draftModel;
	},

	onDraftModelSent: function() {
		this.removeDraftModel();
	},

	/**
	 * Callback for the draft model's event "destroy"
	 *
	 * @private
	 *
	 * @param {module:Pipedrive.Model} draftModelFromEvent
	 * @void
	 */
	onDraftModelDestroy: function(draftModelFromEvent) {
		if (!this.draftModel) {
			logger.warn('Got draft "destroy" event, but no draft assigned to the collection!');

			return;
		} else if (this.draftModel.get('id') !== draftModelFromEvent.get('id')) {
			logger.warn(
				'Got "destroy" event of a draft with a different ID than the draft assigned to the collection!'
			);

			return;
		}

		this.removeDraftModel();
	},

	/**
	 * Unbinds event listeners and sets the draft as null.
	 * @void
	 */
	removeDraftModel: function() {
		if (_.isModel(this.draftModel)) {
			this.stopListening(this.draftModel);
		}

		this.draftModel = null;
	},

	hasOnlyMessagesSentFromPD: function() {
		return (
			!!this.length && this.all((mailMessage) => mailMessage.get('sent_from_pipedrive_flag'))
		);
	}
});
