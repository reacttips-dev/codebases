const Pipedrive = require('pipedrive');
const _ = require('lodash');
const MailMsgCollection = require('collections/mail/messages');
const l10n = require('l10n');
const { MergeFieldsHelpers } = require('@pipedrive/pd-wysiwyg');

/**
 * Thread Model
 */
module.exports = Pipedrive.Model.extend({
	type: 'mailThread',

	allowDirectSync: true,

	// OLD-API-HACK: add thread map here (same as it is in thread-list) so we can validate labels before sending them to BE

	/**
	 * Declare read-only attributes when implementing new API
	 * @type {Array}
	 */
	readonly: [],

	urlRoot: `${app.config.api}/mailbox/mailThreads`,

	fallback: {
		subject: l10n.gettext('(No Subject)')
	},

	mailsCollection: null,

	initialize: function() {
		this.selfUpdateFromSocket();
		this.selfDeleteFromSocket();
		this.attachMailsCollection();
		this.onChange('subject', this.updateSubjectSnippet.bind(this));
		this.updateSubjectSnippet();
	},

	pull: function(options) {
		const errorCallback = options.error;
		const error = _.bind(function(model, xhr, response) {
			if (_.isFunction(errorCallback)) {
				errorCallback(model, xhr, response);
			}

			const errorMessage = `Failed to pull thread-model (ID: ${this.get('id')}, statusCode: ${
				response.statusCode
			})`;

			throw new Error(errorMessage);
		}, this);
		const newOptions = _.assignIn(options, { error });

		return Pipedrive.Model.prototype.pull.call(this, newOptions);
	},

	attachMailsCollection: function() {
		if (this.get('id')) {
			this.mailsCollection = new MailMsgCollection(null, { threadId: this.get('id') });
		}
	},

	isDraftOnly: function() {
		return !this.get('message_count') && !!this.get('has_draft_flag');
	},

	hasDraft: function() {
		return !!this.get('has_draft_flag');
	},

	isShared: function() {
		return !!this.get('shared_flag');
	},

	toggleArchiveFlag: function(toArchive) {
		this.toggleModelFlag('archived_flag', toArchive);
	},

	toggleReadFlag: function(toRead) {
		this.toggleModelFlag('read_flag', toRead);
	},

	toggleVisibility: function(toShared) {
		this.toggleModelFlag('shared_flag', toShared);
	},

	/**
	 * Updates the specified model flag to new state
	 * If the existing flag already has the value, then the save request wont be called
	 * @param  {String}  key      name of the key that is being updated
	 * @param  {Boolean} newState new state of the flag
	 * @void
	 */
	toggleModelFlag: function(key, newState) {
		if (!_.isBoolean(newState)) {
			throw new Error('ThreadModel.toggleModelFlag: invalid input (expected boolean)');
		}

		const valueHasChanged = !!this.get(key) !== newState;

		if (valueHasChanged) {
			this.set(key, newState);
			this.save();
		}
	},

	getMailsCollection: function() {
		return this.mailsCollection;
	},

	/**
	 * Returns merged parties ("from" + "to")
	 * @return {Array}
	 */
	getAllParties: function() {
		const parties = this.get('parties') || [];

		return _.union(parties.from, parties.to, parties.cc);
	},

	linkWithDeal: function(dealId, options) {
		if (!_.isNumber(dealId)) {
			throw new Error('ThreadModel.linkWithDeal: invalid input (expected integer)');
		}

		this.save({ deal_id: dealId }, options);
	},

	unlinkFromDeal: function() {
		this.linkWithDeal(0);
	},

	getLinkedPersonIds: function() {
		const ids = [];

		const parties = this.getAllParties();

		_.forEach(
			parties,
			_.bind((party) => {
				if (party.linked_person_id) {
					ids.push(party.linked_person_id);
				}
			}, this)
		);

		return ids;
	},

	getPreviousAttribute: function(attributeKey) {
		return this.previous && this.previous[attributeKey];
	},

	discardDraft: function() {
		const model = new Pipedrive.Model({
			id: this.id
		});

		model.destroy({
			url: `${app.config.api}/mailbox/mailThreads/${this.id}/mailDrafts`
		});
	},

	/**
	 * Returns one section where the current thread belongs to. If the thread belongs to multiple
	 * sections, returns the first valid one.
	 *
	 * @return {String}
	 */
	getValidSection: function() {
		const allowedSections = ['inbox', 'archive', 'sent', 'drafts'];
		const threadSections = this.get('folders');
		const intersectedFolders = _.intersection(allowedSections, threadSections);
		const fallbackSection = 'inbox';

		let section = !_.isEmpty(intersectedFolders) && intersectedFolders[0];

		if (!section) {
			section = fallbackSection;
		}

		return section;
	},

	// set a subject snippet, parse it for draft messages
	updateSubjectSnippet: function() {
		const subject = this.get('subject');

		const subjectSnippet = this.hasDraft()
			? MergeFieldsHelpers.humanizeFieldSyntax(subject)
			: subject;

		this.set('subject_snippet', subjectSnippet, { silent: true });
	}
});
