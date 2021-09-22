const FilesCollection = require('collections/files');
const AttachmentModel = require('models/mail/attachment');
const _ = require('lodash');

const AttachmentsCollection = FilesCollection.extend({
	model: AttachmentModel,
	initialize: function(models, options) {
		this.options = options || {};

		if (this.options.mailMessageId) {
			this.setMailMessageId(this.options.mailMessageId);
		}

		FilesCollection.prototype.initialize.call(this, models, options);
	},

	// override to add attachment model instead
	addLocalFile: function(file, options) {
		const model = new AttachmentModel(
			null,
			_.assignIn(
				{
					file
				},
				options
			)
		);

		this.add(model);
	},

	url: function() {
		return `${app.config.api}/mailbox/mailAttachments`;
	},

	pull: function(options) {
		if (!this.mailMessageId) {
			return [];
		}

		const pullOpts = _.assignIn(options, {
			// this is a custom flag to differentiate collection "add" events (triggered by pull VS adding separately)
			isPulled: true,
			data: {
				mail_message_ids: [this.mailMessageId].toString()
			},
			success: _.bind(this.onPullSuccess, this)
		});

		FilesCollection.prototype.pull.call(this, pullOpts);
	},

	onPullSuccess: function() {
		const attachments = this.where({ mail_message_id: this.mailMessageId });
		const filesWithWrongMessageId = this.models.filter((val) => !attachments.includes(val));

		_.forEach(filesWithWrongMessageId, (file) => this.remove(file));
	},

	getInlineAttachments: function() {
		const inlineAttachments = this.filter((file) => {
			return file.isInline();
		});

		return inlineAttachments;
	},

	/**
	 * Sets the mail message's id. Used for pulling the attachments of that message.
	 * @param {Number} mailMessageId
	 * @void
	 */
	setMailMessageId: function(mailMessageId) {
		this.mailMessageId = mailMessageId;
	}
});

module.exports = AttachmentsCollection;
