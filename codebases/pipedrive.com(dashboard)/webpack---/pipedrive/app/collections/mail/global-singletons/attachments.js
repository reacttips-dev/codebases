const Pipedrive = require('pipedrive');
const _ = require('lodash');
const AttachmentModel = require('models/mail/attachment');

/**
 * Collection of mail message attachments. A global singleton. All mail v2 attachments are pulled via this class
 * and are cached in here for the whole browser tab session.
 * Mail v2
 */

const AttachmentsCollection = Pipedrive.Collection.extend({
	// See method throttledPull
	pullQueue: [],
	pullTimeout: null,
	// Holds message ids and callbacks of messages to which atatchments are being pulled
	pullPendingCallbacks: [],

	model: AttachmentModel,

	url: function() {
		return `${app.config.api}/mailbox/mailAttachments`;
	},

	initialize: function() {
		app.global.bind('file.model.*.add', this.onFileAddEvent, this);
		app.global.bind('file.model.*.delete', this.onFileDeleteEvent, this);
	},

	/**
	 * Passes the attachments of a message to the given callback, if attachments for the message already pulled.
	 * If attachments not pulled yet, pulls them.
	 *
	 * @param  {Number}   mailMessageId
	 * @param  {Function} callback
	 * @void
	 */
	getAttachments: function(mailMessageId, callback) {
		if (!mailMessageId) {
			return [];
		}

		const attachments = this.where({ mail_message_id: mailMessageId });

		if (attachments.length) {
			return callback(attachments);
		} else {
			this.throttledPull(mailMessageId, callback);
		}
	},

	getAttachmentsModels: function(mailMessageId) {
		if (!mailMessageId) {
			return [];
		}

		return this.where({ mail_message_id: mailMessageId });
	},

	onFileAddEvent: function(fileModel) {
		if (fileModel.get('mail_message_id')) {
			this.add(fileModel);
		}
	},

	onFileDeleteEvent: function(id) {
		const fileToRemove = this.where({ id });

		if (fileToRemove) {
			this.remove(fileToRemove);
		}
	},

	/**
	 * @private
	 *
	 * Adds message ids and corresponding callbacks to the pull queue and pulls attachments for gathered messages.
	 * Used to avoid "spamming" files endpoint when, for example, loading a single thread view
	 * and pulling messages' attachments asynchronously.
	 *
	 * @param  {Number}   mailMessageId
	 * @param  {Function} callback
	 * @void
	 */
	throttledPull: function(mailMessageId, callback) {
		this.pullQueue.push({
			mail_message_id: mailMessageId,
			callback
		});

		if (!_.isEmpty(this.pullPendingCallbacks)) {
			return;
		}

		if (this.pullTimeout) {
			clearTimeout(this.pullTimeout);
		}

		this.pullTimeout = setTimeout(this.pull.bind(this), 300);
	},

	/**
	 * @private
	 *
	 * See throttledPull instead!
	 * @void
	 */
	pull: function() {
		const idsToPull = _.uniq(_.map(this.pullQueue, 'mail_message_id'));
		const pullOpts = {
			data: {
				mail_message_ids: idsToPull.toString()
			},
			success: _.bind(this.onPullSuccess, this),
			error: _.bind(this.onPullError, this, idsToPull),
			remove: false
		};

		this.pullPendingCallbacks = this.pullQueue;
		this.pullQueue = [];

		Pipedrive.Collection.prototype.pull.call(this, pullOpts);
	},

	onPullSuccess: function() {
		_.forEach(
			this.pullPendingCallbacks,
			_.bind(function(obj) {
				const attachments = this.where({ mail_message_id: obj.mail_message_id });

				obj.callback(attachments);
			}, this)
		);

		this.pullPendingCallbacks = [];
		this.tryPullAgain();
	},

	onPullError: function() {
		this.pullPendingCallbacks = [];
		this.tryPullAgain();
	},

	/**
	 * Trigger pull again if something got queued during previous pull
	 */
	tryPullAgain: function() {
		if (!_.isEmpty(this.pullQueue)) {
			if (this.pullTimeout) {
				clearTimeout(this.pullTimeout);
			}

			this.pull();
		}
	}
});

module.exports = new AttachmentsCollection();
