'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const GlobalAttachmentsCollection = require('collections/mail/global-singletons/attachments');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const MailMsgUtils = require('utils/mail/mail-message-utils');
const template = require('./message-actions.html');
const mailMessagePrintTemplate = require('./mail-message-print.html');
const Helpers = require('utils/helpers');
const Cookies = require('js-cookie');
const DropMenu = require('views/ui/dropmenu');
const $ = require('jquery');
const snackbar = require('snackbars');
const webappComponentLoader = require('webapp-component-loader');

require('fancybox');
require('fancybox.resize');

module.exports = Pipedrive.View.extend({
	template: _.template(template),

	STATE: null,

	initialize: function(options) {
		this.options = options;

		this.STATE = new Pipedrive.Model({
			showAttachmentDropmenu: !!this.model.get('has_real_attachments_flag')
		});

		this.listenTo(this.STATE, 'change:showAttachmentDropmenu', this.render);
	},

	getTemplateHelpers: function() {
		return {
			replyForwardAllowed: MailConnections.hasActiveNylasConnection(),
			hasRealAttachments: this.STATE.get('showAttachmentDropmenu'),
			replyMode: this.getReplyMode()
		};
	},

	onLoad: function() {
		this.render();
	},

	afterRender: function() {
		this.initDropMenu();

		if (this.STATE.get('showAttachmentDropmenu')) {
			GlobalAttachmentsCollection.getAttachments(
				this.model.id,
				this.initAttachmentDropmenu.bind(this)
			);
		}
	},

	getReplyMode: function() {
		const replyModes = {
			reply: {
				icon: 'reply',
				action: _.bind(this.onMailAction, this, 'reply')
			},
			reply_all: {
				icon: 'replyall',
				action: _.bind(this.onMailAction, this, 'reply_all')
			}
		};

		return replyModes[this.model.getDefaultReplyMode() || 'reply'];
	},

	/**
	 * Handler for mail related actions (e.g user selects 'reply' or 'forward')
	 * @param  {String} action name of the action
	 * @void
	 */
	onMailAction: function(action) {
		this.dropMenu.close();
		this.$el.trigger('mailActionInvoked', [action, this.model]);

		this.options.sendPageActionMetrics('invoke-mail-action', {
			'mail-v2.param.action': action
		});
	},

	printMessage: function() {
		this.options.sendPageActionMetrics('invoke-mail-action', {
			'mail-v2.param.action': 'print'
		});

		const bodyClone = this.$el
			.parents('.mail-msg-comp')
			.find('.messageBody')
			.clone();
		const appVersionParam = app.config.version ? `?v=${app.config.version}` : '';
		const bodyHtml = _.template(mailMessagePrintTemplate)({
			mainCss: `${app.config.static}/css/main.css${appVersionParam}`,
			css: `${app.config.static}/css/index.css${appVersionParam}`,
			model: this.model,
			fromPartyName: this.options.fromPartyName,
			getPartiesLinks: this.options.getPartiesLinks.bind(this),
			messageTime: sanitizeHtml(
				MailMsgUtils.getMessageTimeString.call(
					MailMsgUtils,
					this.model.get('message_time')
				),
				{ loose: true }
			),
			message: bodyClone[0].outerHTML
		});
		const win = window.open('', 'printwindow');

		win.document.write(bodyHtml);
	},

	deleteMessage: async function() {
		// eslint-disable-next-line max-len
		const confirm = _.gettext(
			'Are you sure you want to delete this email message from Pipedrive? You can’t undo this action.'
		);

		if (window.confirm(confirm)) {
			const modals = await webappComponentLoader.load('froot:modals');
			const isLastMessage = this.model.collection.length === 1;
			const isMailPage = Helpers.isLastRouteMailPage(app.router.lastRoute);

			this.model.destroy({
				success: function() {
					snackbar.show({
						text: _.gettext('Message has been deleted')
					});
				}
			});

			if (isLastMessage) {
				isMailPage
					? app.router.go(null, `/mail/${this.options.section}`, true)
					: modals.close();
			}

			this.options.sendPageActionMetrics(null, null, 'mail-deleted');
		}
	},

	initDropMenu: function() {
		const disabled = !MailConnections.hasActiveNylasConnection();
		const data = [
			{
				className: 'hasIcon',
				titleHtml: `<span class="icon">${_.icon('reply', 'small')}</span>${_.gettext(
					'Reply'
				)}`,
				click: disabled ? null : _.bind(this.onMailAction, this, 'reply')
			},
			{
				className: 'hasIcon',
				titleHtml: `<span class="icon">${_.icon('forward', 'small')}</span>${_.gettext(
					'Forward'
				)}`,
				click: disabled ? null : _.bind(this.onMailAction, this, 'forward')
			},
			{
				title: _.gettext('Print'),
				click: _.bind(this.printMessage, this)
			},
			{
				title: _.gettext('Delete'),
				click: _.bind(this.deleteMessage, this)
			}
		];

		if (this.model.getDefaultReplyMode() === 'reply_all') {
			data.splice(1, 0, {
				className: 'hasIcon',
				titleHtml: `<span class="icon">${_.icon('replyall', 'small')}</span>${_.gettext(
					'Reply to all'
				)}`,
				click: _.bind(this.onMailAction, this, 'reply_all')
			});
		}

		this.dropMenu = new DropMenu({
			data,
			className: 'mailActions',
			ui: 'arrowDropmenu',
			target: this.$('.actionsDropmenu'),
			alignRight: true
		});
	},

	initAttachmentDropmenu: function(attachments) {
		this.updateAttachmentDropmenuCount(attachments.length);

		this.attachmentDropmenu = new DropMenu({
			data: this.generateAttachmentDropmenuListData(attachments),
			ui: 'arrowDropmenu',
			target: this.$('.attachmentDropmenu'),
			alignRight: true,
			className: 'attachmentDropmenuList'
		});

		this.listenTo(
			GlobalAttachmentsCollection,
			'add',
			_.debounce(this.updateAttachmentDropmenu.bind(this), 1000)
		);
	},

	updateAttachmentDropmenu: function() {
		GlobalAttachmentsCollection.getAttachments(this.model.id, (attachments) => {
			this.updateAttachmentDropmenuCount(attachments.length);
			this.attachmentDropmenu.config.data = this.generateAttachmentDropmenuListData(
				attachments
			);

			if (this.attachmentDropmenu.isVisible) {
				this.attachmentDropmenu.renderContent(true);
			}
		});
	},

	updateAttachmentDropmenuCount: function(attachmentsCount) {
		this.$('.attachmentDropmenu .attachmentsCount').text(attachmentsCount);
	},

	generateAttachmentDropmenuListData: function(attachments) {
		const data = [];

		_.each(
			attachments,
			_.bind(function(attachmentModel) {
				const attachmentName = _.escape(attachmentModel.get('name'));

				data.push({
					titleHtml: `<span data-file-type="${attachmentModel.get(
						'file_type'
					)}" title="${_.escape(attachmentName)}">${_.escape(
						attachmentModel.get('name')
					)}</span>`,
					click: _.bind(this.onAttachmentClicked, this, attachmentModel)
				});
			}, this)
		);

		return data;
	},

	/**
	 * If attachment is an image, displays it inline. Otherwise, lets default action happen.
	 * @param  {Model} attachmentModel
	 * @param  {Object} ev
	 * @void
	 */
	onAttachmentClicked: function(attachmentModel, ev) {
		this.attachmentDropmenu.close();

		if (
			attachmentModel.get('file_type') === 'img' &&
			// Fallback to browser default behaviour in case of unsupported HEIF/ISO/PSD/TIFF Base Media file formats
			!attachmentModel.hasExtension(['heif', 'heic', 'psd', 'tiff', 'tif'])
		) {
			ev.preventDefault();
			ev.stopPropagation();

			$.fancybox({
				href: `${attachmentModel.get('url')}?session_token=${Cookies.get(
					'pipe-session-token'
				)}`,
				minWidth: 40,
				minHeight: 40,
				openEffect: 'none',
				closeEffect: 'none',
				type: 'image'
			});
		} else {
			window.open(
				`${attachmentModel.get('url')}?session_token=${Cookies.get('pipe-session-token')}`,
				'AttachmentWindow',
				'noopener,noreferrer'
			);
		}

		this.options.sendPageActionMetrics(null, null, 'attachment-viewed');
	}
});
