'use strict';

const ActionsBarComponent = require('../../../components/mail-thread-actions-bar/mail-thread-actions-bar');
const _ = require('lodash');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const template = require('./actions-bar.html');
const DropMenu = require('views/ui/dropmenu');
const PDMetrics = require('utils/pd-metrics');
const iamClient = require('utils/support/iam');
const MailConnections = require('collections/mail/global-singletons/mail-connections');

const ComposerActionsBarView = ActionsBarComponent.extend({
	template: _.template(template),
	getTemplateHelpers: function() {
		const templateHelpers = _.assignIn(
			{
				threadModel: this.threadModel,
				shareButtonText: this.getShareButtonText(this.threadModel.isShared())
			},
			ActionsBarComponent.prototype.getTemplateHelpers.call(this)
		);

		templateHelpers.threadPositionHtml = sanitizeHtml(
			`${templateHelpers.currentThreadPosition}&#8202;/&#8202;${templateHelpers.threadCount}`
		);

		return templateHelpers;
	},
	getShareDropMenuOptions: function() {
		const data = [
			{
				id: 'share',
				titleHtml: `<span class="actionContainer">
						<span class="actionIcon">${_.icon('unlocked', 'small')}</span>
						<span class="actionHeaderText">${_.gettext('Share within your company')}</span>
						<p class="actionDescriptionText">${_.gettext(
							'This email conversation will be visible to others only when it’s linked to contacts and deals in Pipedrive.'
						)}</p>
					</span>`,
				click: this.onShareOptionClick.bind(this, true)
			},
			{
				id: 'makePrivate',
				titleHtml: `<span class="actionContainer">
						<span class="actionIcon">${_.icon('ac-padlock', 'small')}</span>
						<span class="actionHeaderText">${_.gettext('Keep this conversation private')}</span>
						<p class="actionDescriptionText">${_.gettext(
							'This email conversation can still be linked to contacts and deals in Pipedrive, but it will only be visible to you.' // NOSONAR
						)}</p>
					</span>`,
				click: this.onShareOptionClick.bind(this, false)
			}
		];

		return data;
	},
	initShareDropMenu: function() {
		this.dropmenu = new DropMenu({
			target: this.$('.share'),
			ui: 'arrowDropmenu',
			className: 'privacyDropmenu',
			activeOnClick: true,
			data: this.getShareDropMenuOptions()
		});

		// Show the "Share" button once the unsaved thread gets saved
		if (this.threadModel.isNew()) {
			this.listenToOnce(
				this.threadModel,
				'change:id',
				_.bind(function() {
					this.threadModel.pull({
						success: function() {
							this.setShareButtonText(
								this.getShareButtonText(this.threadModel.isShared())
							);
							this.$('.barItems .share').show();
						}.bind(this),
						error: null
					});
				}, this)
			);
		}
	},

	getShareButtonText: function(isShared) {
		return isShared ? _.gettext('Shared') : _.gettext('Private');
	},

	setShareButtonText: function(shareButtonText) {
		this.$('.shareButtonText').text(shareButtonText);
	},

	onAttachedToDOM: function() {
		const settingsButton = document.querySelector('.emailSettingsButton');

		if (!settingsButton) {
			return;
		}

		if (!MailConnections.isMicrosoftConnection()) {
			iamClient.initialize(() => {
				iamClient.addCoachmark(
					iamClient.coachmarks.EMAIL_SENDER_NAME_FIELD,
					settingsButton
				);
			});
		}
	},

	onShareOptionClick: function(toShared) {
		const shareButtonText = this.getShareButtonText(toShared);

		this.sendMetrics('change-shared-state', {
			'mail-v2.param': toShared ? 'to-shared' : 'to-private'
		});
		this.setShareButtonText(shareButtonText);

		this.threadModel.toggleVisibility(toShared);
	},

	sendMetrics: function(action, params) {
		const data = _.assignIn(
			{
				'mail-v2.feature': 'compose-new-thread_actions-bar',
				'mail-v2.action': action
			},
			params
		);

		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', data);
	},

	getBackButtonHref: function() {
		return '/mail/drafts';
	},
	afterRender: function() {
		this.initTooltips();
		this.initShareDropMenu();
	}
});

module.exports = ComposerActionsBarView;
