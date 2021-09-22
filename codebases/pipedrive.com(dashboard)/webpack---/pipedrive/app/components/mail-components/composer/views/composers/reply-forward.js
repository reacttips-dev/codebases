const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const { InlineImagesPlugin } = require('@pipedrive/pd-wysiwyg');
const BaseComposer = require('../base-composer');
const _ = require('lodash');
const GlobalAttachmentsCollection = require('collections/mail/global-singletons/attachments');
const forwardTemplate = require('../../templates/forward-quote.html');
const Colors = require('utils/colors');
const MailHelpers = require('utils/mail/helpers');
const MailMsgUtils = require('utils/mail/mail-message-utils');
const moment = require('moment');
const Cookies = require('js-cookie');
const $ = require('jquery');
const quoteStyle = `margin: 0 0 0 .8em; border-left: 2px ${Colors['$color-blue-hex']} solid; padding-left: 1em`;

/**
 * Mail composer, used when replying to or forwarding an existing mail in an exiting thread
 *
 * @class  components/MailComposer/composers/ReplyForwardComposer
 *
 * @param {Object} opts      Initial options
 * @extends {components/MailComposer/BaseComposer}
 */
module.exports = BaseComposer.extend({
	forwardQuoteTemplate: _.template(forwardTemplate),

	// The new or saved draft message model
	draftModel: null,
	// Model of the message being replied to or forwarded
	relatedMessage: null,

	initialize: function(opts) {
		this.relatedMessage = opts.relatedMessage;
		this.sendmode = opts.draftModel.getSendmode();
		BaseComposer.prototype.initialize.call(this, opts);
		this.draftModel.setRelatedMessage(this.relatedMessage);
	},

	afterRender: function() {
		BaseComposer.prototype.afterRender.call(this);
		this.initQuotes();
		this.listenTo(this.headerView, 'sendmodeSelected', this.onSendmodeSelected);
	},

	/**
	 * Initializes the quote elements and sets blockquotes if necessary
	 * @return {void}
	 */
	initQuotes: function() {
		if (this.draftModel.isNew()) {
			let relatedMessageBody = this.relatedMessage.get('body') || '';

			relatedMessageBody = MailHelpers.removeOpenTrackingPixels(relatedMessageBody);

			this.setBlockquote(relatedMessageBody);
		} else {
			this.findAndWrapExistingBlockQuote();
		}
	},

	/**
	 * initializes the quote button elements and bind listeners
	 * @return {Object} JQuery element
	 */
	getQuoteButtonElement: function() {
		const buttonHtml = _.form.button({
			icon: 'ellipsis',
			size: 's',
			className: 'secondary',
			action: this.onQuoteButtonClick.bind(this)
		});

		return $('<div/>', { class: 'expandQuoteBtn' }).html(buttonHtml);
	},

	onQuoteButtonClick: function(ev) {
		ev.preventDefault();

		const blockQuoteWrapper = this.$('[data-type="blockQuoteWrapper"]');

		if (blockQuoteWrapper.length) {
			// once we add quote we also add empty div with br tag
			// as we remove quote block we also need to remove that div
			blockQuoteWrapper.prev().remove();
			blockQuoteWrapper.remove();

			return;
		}

		this.$('.bodyEditor')
			.append($('<div><br /></div>'))
			.append(this.getBlockquote());
		this.prepareInlineImages();
		this.focusField();
	},

	onSendmodeSelected: function(sendmode) {
		this.changeSendmode(sendmode);
	},

	/**
	 * Resets the composer according to the sendmode.
	 * @param {String} sendmode
	 * @void
	 */
	changeSendmode: function(sendmode) {
		this.sendmode = sendmode;
		this.headerView.changeSendmode(this.sendmode);

		if (this.draftModel.isNew()) {
			this.removeQuoteButton();
			this.setBodyEditorContent(this.draftModel.getSignature());
			this.setBlockquote(this.relatedMessage.get('body'));

			if (this.sendmode === 'forward') {
				this.attachmentsView.reInitializeRowViews(this.getPreparedAttachments().models);
			} else {
				this.attachmentsView.removePlaceHolderRows();
			}
		}
	},

	setBodyEditorContent: function(content) {
		const sanitizedBody = sanitizeHtml(content);
		const $bodyEditor = this.$('.bodyEditor[contenteditable]');

		$bodyEditor.html(sanitizedBody);
	},

	/**
	 * Gets current active quoteblock
	 * @return {object} quoteblock element
	 */
	getBlockquote: function() {
		return this.$quote;
	},

	setBlockquote: function(content) {
		if (!content) {
			return;
		}

		const $bodyEditor = this.$('.bodyEditor[contenteditable]');
		const $richTextArea = this.$('.richTextArea');
		const $quoteButton = this.getQuoteButtonElement();
		const sanitizedContent = sanitizeHtml(content, { loose: true });

		if (this.sendmode === 'forward') {
			this.$quote = this.getForwardingQuote(sanitizedContent);

			$bodyEditor.append($('<br/>')).append(this.$quote);
		} else {
			this.$quote = this.getDefaultQuote(sanitizedContent);

			$bodyEditor.after($quoteButton);
			$richTextArea.addClass('hasQuote');
		}

		this.prepareInlineImages();
	},

	prepareInlineImages: function() {
		const attachments = this.getPreparedAttachments().toJSON();
		const sesstionToken = `session_token=${Cookies.get('pipe-session-token')}`;

		this.contentEditable.callPluginMethod(
			InlineImagesPlugin.name,
			'prepareInlineImagesForDisplaying',
			[attachments, sesstionToken]
		);
	},

	/**
	 * Finds blockquote element from the mail body, detaches it and appends quote button instead of it
	 * PS! we don't wrap forward Quotes
	 * @void
	 */
	findAndWrapExistingBlockQuote: function() {
		const $bodyEditorWrapper = this.$('.bodyEditorWrapper');
		const $blockQuoteInComposer =
			$bodyEditorWrapper.find('div[data-type=blockQuoteWrapper]:first') ||
			$bodyEditorWrapper.find('blockquote[data-type=default]:first');
		const $richTextArea = this.$('.richTextArea');
		const $bodyEditor = this.$('.bodyEditor[contenteditable]');

		if ($blockQuoteInComposer.length) {
			const $quoteButton = this.getQuoteButtonElement();

			$blockQuoteInComposer.detach();

			this.$quote = $blockQuoteInComposer;

			$bodyEditor.after($quoteButton);
			$richTextArea.addClass('hasQuote');
		}
	},

	getMessageTimeQuote: function() {
		const messageTime = this.relatedMessage.get('message_time');
		const messageTimeFormatted = moment
			.utc(messageTime)
			.local()
			.format('llll');
		const messageFrom = this.relatedMessage.get('from') && this.relatedMessage.get('from')[0];
		const messageFromName = MailMsgUtils.getPartyDisplayName(messageFrom);

		return _.gettext('%s, %s %s wrote:', [
			messageTimeFormatted,
			messageFromName,
			`<${messageFrom.email_address}>`
		]);
	},

	/**
	 * Wraps content message into quote block
	 * @param  {string} content content message body that goes into the quote block
	 * @return {object}         quoted element
	 */
	getDefaultQuote: function(content) {
		const $quoteWrapper = $('<div data-type="blockQuoteWrapper">');
		const messageTimeQuote = this.getMessageTimeQuote();
		const $quote = $(`<blockquote data-type="default" style="${quoteStyle}">`).html(content);

		return $quoteWrapper.text(messageTimeQuote).append($quote);
	},

	/**
	 * Wraps content message into forwarding quote block
	 * @param  {string} content message body that goes into the quote block
	 * @return {object}         quoted element
	 */
	getForwardingQuote: function(content) {
		const fromPartyData = this.relatedMessage.get('from') && this.relatedMessage.get('from')[0];
		const fromName = fromPartyData
			? fromPartyData.linked_person_name || fromPartyData.name || ''
			: '';
		const forwardTemplateOptions = {
			fromName,
			fromAddress: this.relatedMessage.get('from')
				? this.relatedMessage.get('from')[0].email_address
				: '',
			messageTime: moment
				.utc(this.relatedMessage.get('message_time'))
				.local()
				.format('LLL'),
			subject: this.relatedMessage.get('subject'),
			toAddress: this.getMsgAddressList('to'),
			ccAddress: this.getMsgAddressList('cc')
		};

		return $(this.forwardQuoteTemplate(forwardTemplateOptions)).append(content);
	},

	removeQuoteButton: function() {
		const editorBodyField = this.$('div.richTextArea');

		editorBodyField.find('.bodyEditorWrapper > div.expandQuoteBtn').remove();
		editorBodyField.removeClass('hasQuote');
		this.$quote = null;
	},

	getMsgAddressList: function(type) {
		let addressList = '';

		if (type === 'cc' && this.relatedMessage.get('cc')) {
			addressList = this.relatedMessage
				.get('cc')
				.map((item) => {
					return item.email_address;
				})
				.join(', ');
		} else if (type === 'to' && this.relatedMessage.get('to')) {
			addressList = this.relatedMessage
				.get('to')
				.map((item) => {
					return item.email_address;
				})
				.join(', ');
		}

		return addressList;
	},

	getDataForSaving: function(options, attachmentsForDuplication) {
		const relatedAttachments = this.draftAttchmentsCollection.models;
		const forwardingAttachments = _.filter(relatedAttachments, (attachment) => {
			return !!attachment.get('attachmentPlaceholder') && !attachment.get('mail_template_id');
		});

		let attachmentsIds = [];

		const data = _.assignIn({}, this.getData(false, false, true), {
			reply_to_message_id: this.relatedMessage.get('id')
		});

		if (!_.isEmpty(attachmentsForDuplication)) {
			data.has_template_attachments = true;
			attachmentsIds = attachmentsIds.concat(_.map(attachmentsForDuplication, 'id'));
		}

		if (this.sendmode === 'forward' && !_.isEmpty(forwardingAttachments)) {
			_.each(forwardingAttachments, (model) => {
				if (!model.isInline()) {
					attachmentsIds.push(model.id);
				}
			});
		}

		data.file_ids = _.isEmpty(attachmentsIds) ? null : attachmentsIds;

		return data;
	},

	getAttachmentCollection: function() {
		let collection = {};

		if (
			this.sendmode === 'forward' &&
			this.relatedMessage.get('has_attachments_flag') &&
			this.draftModel.isNew()
		) {
			collection = this.getPreparedAttachments();
		} else {
			collection = BaseComposer.prototype.getAttachmentCollection.call(this);
		}

		return collection;
	},

	getPreparedAttachments: function() {
		const attachments = GlobalAttachmentsCollection.getAttachmentsModels(
			this.relatedMessage.id
		);
		const attachmentsPlaceholders = [];

		_.each(attachments, (attachmentModel) => {
			const placeholder = attachmentModel.clone();

			placeholder.set('attachmentPlaceholder', 1);
			attachmentsPlaceholders.push(placeholder);
		});

		return this.draftModel.setAttachmentCollection(attachmentsPlaceholders);
	},

	onSaveDraftSuccess: function(options, model, response) {
		const draftRelatedObjFiles = _.get(response, 'related_objects.files', null);

		if (this.sendmode === 'forward' && draftRelatedObjFiles) {
			this.attachmentsView.reInitializeRowViews(draftRelatedObjFiles);
		}

		BaseComposer.prototype.onSaveDraftSuccess.call(this, options, model);
	},

	getRelatedMessageId: function() {
		return this.draftModel.get('reply_to_message_id');
	}
});
