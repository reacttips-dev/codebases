'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const template = require('./attachments.html');
const GlobalAttachmentsCollection = require('collections/mail/global-singletons/attachments');
const SingleAttachmentView = require('./single-attachment');
const Helpers = require('utils/helpers');
const $ = require('jquery');

const AttachmentsView = Pipedrive.View.extend({
	template: _.template(template),
	templateHelpers: {},

	initialize: function(options) {
		this.options = options;
		GlobalAttachmentsCollection.on('add', _.bind(this.onFileAddedEvent, this));
	},

	onLoad: function() {
		this.render();
	},

	onFileAddedEvent: function(fileModel) {
		const messageId = this.options.mail_message_id;

		if (messageId && fileModel.get('mail_message_id') === messageId) {
			this.showAttachments([fileModel]);
		}
	},

	addAttachments: function() {
		const messageId = this.options.mail_message_id;

		GlobalAttachmentsCollection.getAttachments(messageId, _.bind(this.showAttachments, this));
	},

	afterRender: function() {
		this.addAttachments();
	},

	/**
	 * Picks real attachments from all the attachments of this message and displays them.
	 * If no real attachmnets found for this message, stops and triggers "noattachments" event.
	 * @param  {Array} attachments
	 * @void
	 */
	showAttachments: function(attachments) {
		attachments = this.filterRealAttachments(attachments);

		// is there any real attachments or not we shouldn't show the loader anymore
		// as files requests are already done
		this.$('[data-attachments="loading"]').hide();

		if (!attachments.length) {
			return;
		}

		this.$('[data-attachments="cards"]').show();

		_.forEach(attachments, _.bind(this.showSingleAttachment, this));
	},

	/**
	 * Removes attachments with inline_flag === true from the provided list
	 * @param  {Array} attachments 	Unfiltered list of attachments
	 * @return {Array} 				Filtered list of attachments
	 */
	filterRealAttachments: function(attachments) {
		return _.filter(attachments, (attachment) => {
			return !attachment.get('inline_flag') || attachment.get('file_type') !== 'img';
		});
	},

	/**
	 * Helper row is the row that is displayed if the message has more than one attachment.
	 * Shows the count and size of all message's attachments together.
	 * @param  {Array} attachments 	List of attachments models
	 * @void
	 */
	showHelperRow: function(attachments) {
		const filesizeSum = this.getFilesizeSum(attachments);

		this.$('.attachmentsCount').text(attachments.length);
		this.$('.sizeSum').text(filesizeSum);
		this.$('[data-attachments="helper-row"]').show();
	},

	/**
	 * @param  {Array} attachments
	 * @return {String}
	 */
	getFilesizeSum: function(attachments) {
		let sizeSum = 0;

		_.forEach(attachments, (attachment) => {
			sizeSum = sizeSum + attachment.get('file_size');
		});

		return Helpers.combineHumanizedFileSize(sizeSum);
	},

	showSingleAttachment: function(attachmentModel) {
		const selector = `data-attachm-card="${attachmentModel.get('id')}"`;
		const $attachCard = $(`<div ${selector}>`);
		const attachmentView = new SingleAttachmentView({
			model: attachmentModel,
			mail_thread_id: this.options.mail_thread_id,
			smart_bcc_flag: this.options.smart_bcc_flag
		});

		this.$('[data-attachments="cards"]').append($attachCard);
		this.addView(`[${selector}]`, attachmentView);
	}
});

module.exports = AttachmentsView;
