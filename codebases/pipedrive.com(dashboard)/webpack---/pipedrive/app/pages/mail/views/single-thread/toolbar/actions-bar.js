'use strict';

const ActionsBarComponent = require('../../../components/mail-thread-actions-bar/mail-thread-actions-bar');
const User = require('models/user');
const _ = require('lodash');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const $ = require('jquery');
const template = require('./actions-bar.html');
const snackbar = require('snackbars');
const PDMetrics = require('utils/pd-metrics');

const SingleThreadActionsBarView = ActionsBarComponent.extend({
	template: _.template(template),

	/**
	 * Should be passed in by parent view when user navigates to single-thread view FROM threads-list.
	 * It's used to navigate to next / previous thread.
	 * If user lands directly in the single-thread view (not via threads list), there will be no
	 * threads collection passed in and no navigation buttons in the toolbar.
	 */
	threadsCollection: null,

	getTemplateHelpers: function() {
		const templateHelpers = _.assignIn(
			{
				threadsPrimaryFolder: this.getThreadsPrimaryFolder(),
				section: this.options.section,
				onArchiveClick: _.bind(this.toggleArchiveFlag, this, true),
				onMoveToInboxClick: _.bind(this.toggleArchiveFlag, this, false),
				onDeleteClick: _.bind(this.onDeleteClick, this),
				onMarkAsUnreadClick: _.bind(this.onMarkAsUnreadClick, this),
				showSettingsButton: User.settings.get('custom_sender_name_field_visible')
			},
			ActionsBarComponent.prototype.getTemplateHelpers.call(this)
		);

		templateHelpers.threadPositionHtml = sanitizeHtml(
			`${templateHelpers.currentThreadPosition}&#8202;/&#8202;<span data-threads-count>${templateHelpers.threadCount}</span>`
		);

		return templateHelpers;
	},

	getThreadsPrimaryFolder: function() {
		return _.without(this.threadModel.get('folders'), 'drafts', 'sent')[0];
	},

	toggleIconButtons: function() {
		const actionsBarWidth = this.$('.singleThreadActionBar').width();
		const leftActionsWidth = this.$('.textButtons').width();
		const rightActionsWidth = this.$('.barItems.floatr').width() + 32;
		const wontFit = actionsBarWidth < leftActionsWidth + rightActionsWidth;

		this.$('.iconButtons').toggle(wontFit);
		this.$('.textButtons').toggle(!wontFit);
	},

	initTooltips: function() {
		const $tooltips = this.$('button[data-tooltip]');

		$tooltips.each(function() {
			$(this).tooltip({
				tip: $(this).data('tooltip'),
				position: 'bottom'
			});
		});

		ActionsBarComponent.prototype.initTooltips.call(this);
	},

	bindEvents: function() {
		$(window).on(
			'resize.singleThreadActionsBar',
			_.throttle(() => {
				this.toggleIconButtons();
			}, 100)
		);

		ActionsBarComponent.prototype.bindEvents.call(this);
	},

	unbindEvents: function() {
		$(window).off('resize.singleThreadActionsBar');

		ActionsBarComponent.prototype.unbindEvents.call(this);
	},

	onAttachedToDOM: function() {
		this.toggleIconButtons();
		ActionsBarComponent.prototype.afterRender.call(this);
	},

	afterRender: function() {
		ActionsBarComponent.prototype.afterRender.call(this);
		this.toggleIconButtons();
	},

	toggleArchiveFlag: function(toArchive) {
		const text = toArchive
			? _.gettext('The conversation has been archived')
			: _.gettext('The conversation has been moved to Inbox');

		this.sendMetrics(`move-to-${toArchive ? 'archive' : 'inbox'}`);

		this.threadModel.toggleArchiveFlag(toArchive);

		snackbar.show({
			text
		});

		app.router.go(null, `/mail/${this.options.section}`);
	},

	onDeleteClick: function() {
		/* eslint-disable max-len */
		const confirmMessage = _.gettext(
			'Are you sure you want to delete this email conversation from Pipedrive? You can’t undo this action.'
		);

		/* eslint-enable max-len */

		const userConfirmed = window.confirm(confirmMessage);

		this.sendMetrics('delete-thread', { 'mail-v2.param.user-confirmed': userConfirmed });

		if (userConfirmed) {
			this.threadModel.destroy({
				success: function() {
					snackbar.show({
						text: _.gettext('The conversation has been deleted')
					});
				}.bind(this)
			});
			app.router.go(null, `/mail/${this.options.section}`, true);
		}
	},

	onMarkAsUnreadClick: function() {
		this.threadModel.toggleReadFlag(false);
		snackbar.show({
			text: _.gettext('The conversation has been marked as unread')
		});
		this.sendMetrics('change-read-state', { 'mail-v2.param': 'to-unread' });

		app.router.go(null, `/mail/${this.options.section}`);
	},

	sendMetrics: function(action, params) {
		const data = _.assignIn(
			{
				'mail-v2.feature': 'single-thread_actions-bar',
				'mail-v2.action': action
			},
			params
		);

		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', data);
	}
});

module.exports = SingleThreadActionsBarView;
