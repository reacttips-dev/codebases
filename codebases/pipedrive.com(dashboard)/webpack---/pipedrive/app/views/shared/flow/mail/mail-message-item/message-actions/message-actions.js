'use strict';

const MailMessageActions = require('components/mail-components/message/message-actions/message-actions');
const _ = require('lodash');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const messageActionTemplate = require('./message-actions.html');
const DropMenu = require('views/ui/dropmenu');
const webappComponentLoader = require('webapp-component-loader');

module.exports = MailMessageActions.extend({
	template: _.template(messageActionTemplate),

	getTemplateHelpers: function() {
		return {
			model: this.model,
			replyForwardAllowed: MailConnections.hasActiveNylasConnection(),
			hasRealAttachments: this.STATE.get('showAttachmentDropmenu'),
			replyMode: this.getReplyMode()
		};
	},

	initDropMenu: function() {
		if (!this.model.isOwnerOfMessage()) {
			return;
		}

		this.dropMenu = new DropMenu({
			data: this.getDropMenuItems(),
			className: 'mailActions',
			ui: 'arrowDropmenu',
			target: this.$('.dropmenu'),
			alignRight: true
		});
	},

	getDropMenuItems: function() {
		let items = [];

		if (this.model.isOwnerOfMessage() && !!MailConnections.hasActiveNylasConnection()) {
			const defaultReplyMode = this.model.getDefaultReplyMode();
			const replyIconKey = defaultReplyMode === 'reply_all' ? 'replyall' : 'reply';

			items = [
				{
					className: 'hasIcon',
					titleHtml: `<span class="icon">${_.icon(
						replyIconKey,
						'small'
					)}</span>${_.gettext('Reply to this email')}`,
					click: _.bind(this.onMessageReplyForwardAction, this, defaultReplyMode)
				},
				{
					className: 'hasIcon',
					titleHtml: `<span class="icon">${_.icon('forward', 'small')}</span>${_.gettext(
						'Forward this email'
					)}`,
					click: _.bind(this.onMessageReplyForwardAction, this, 'forward')
				},
				{
					title: _.gettext('Delete this email'),
					click: _.bind(this.deleteMessage, this)
				},
				{
					title: '---'
				}
			];
		}

		items.push({
			title: _.gettext('View full conversation'),
			click: _.bind(this.onViewFullConversationAction, this, null)
		});

		if (this.options.relatedModel.type === 'deal') {
			items.push({
				title: _.gettext('Unlink this conversation from the deal'),
				click: _.bind(function() {
					if (window.confirm(_.gettext('Are you sure?'))) {
						this.model.unlinkThreadFromDeal();

						this.options.sendPageActionMetrics(null, null, 'mail-unlinked');
					}
				}, this)
			});
		}

		return items;
	},

	onMessageReplyForwardAction: function(sendmode) {
		const params = this.getModalDefaultOpts();

		params.composerOptions = {
			sendmode,
			relatedMessage: this.model
		};

		this.openThreadModal(params);

		this.options.sendPageActionMetrics(
			'invoke-mail-action',
			{
				'mail-v2.param.action': sendmode
			},
			`${sendmode}-clicked`
		);
	},

	/**
	 * Get default data for modal
	 * @return {Object}
	 */
	getModalDefaultOpts: function() {
		return {
			threadId: this.model.get('mail_thread_id'),
			relatedModelType: this.options.relatedModel.type,
			metricsData: {
				'mail-v2.param.where': 'flow'
			}
		};
	},

	getReplyMode: function() {
		const replyModes = {
			reply: {
				icon: 'reply',
				action: _.bind(this.onMessageReplyForwardAction, this, 'reply')
			},
			reply_all: {
				icon: 'replyall',
				action: _.bind(this.onMessageReplyForwardAction, this, 'reply_all')
			}
		};

		return replyModes[this.model.getDefaultReplyMode()];
	},

	/**
	 * Action when 'View full conversation' is clicked
	 * @void
	 */
	onViewFullConversationAction: function() {
		this.options.sendPageActionMetrics(
			'view-full-conversation',
			null,
			'full-conversation-viewed'
		);

		const params = this.getModalDefaultOpts();

		this.openThreadModal(params);
	},

	/**
	 * Open thread modal with correct data
	 * @param  {Object} params
	 * @void
	 */
	openThreadModal: async function(params) {
		const modals = await webappComponentLoader.load('froot:modals');

		app.global.fire('deal.flow.compose.close', { tab: 'email', id: this.model.get('id') });
		modals.open('webapp:modal', { modal: 'mail/thread', params });
	}
});
