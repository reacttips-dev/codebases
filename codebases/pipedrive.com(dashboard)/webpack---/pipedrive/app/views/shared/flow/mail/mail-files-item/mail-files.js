'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const AttachmentsView = require('components/mail-components/attachments/attachments');
const MailMsgUtils = require('utils/mail/mail-message-utils');
const template = require('./mail-files.html');
const MailFilesView = Pipedrive.View.extend({
	template: _.template(template),

	templateHelpers: {},

	events: {
		'click .headerInfo a.party': 'onPartyClicked',
		'click .messageHeader .collapseExpandButtons button': 'showHideDetails'
	},

	initialize: function() {
		this.initAttachmentsView();
	},

	getTemplateHelpers: function() {
		return {
			model: this.model,
			getPartiesLinks: _.bind(this.getPartiesLinks, this),
			messageTime: sanitizeHtml(
				MailMsgUtils.getMessageTimeString.call(
					MailMsgUtils,
					this.model.get('message_time')
				),
				{ loose: true }
			)
		};
	},

	onLoad: function() {
		this.render();
	},

	getPartiesLinks: function(partyType, withEmail) {
		return MailMsgUtils.getPartiesLinks(this.model.get(partyType), withEmail);
	},

	initAttachmentsView: function() {
		const messageId = this.model.get('id');
		const attachmentsView = new AttachmentsView({
			mail_message_id: messageId
		});

		this.addView('[data-flow-mail-files="attachments"]', attachmentsView);
	},

	onPartyClicked: function(ev) {
		MailMsgUtils.onPartyClicked.call(MailMsgUtils, ev, this.model);
	},

	showHideDetails: function(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		this.$('.messageHeader').toggleClass('details');
	}
});

module.exports = MailFilesView;
