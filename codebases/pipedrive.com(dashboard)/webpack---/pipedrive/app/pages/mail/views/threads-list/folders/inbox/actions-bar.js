const ListActionsBarComponent = require('../../../../components/list-actions-bar/list-actions-bar');
const _ = require('lodash');
const template = require('./actions-bar.html');
const snackbar = require('snackbars');
const DropMenu = require('views/ui/dropmenu');
const User = require('models/user');
const PDMetrics = require('utils/pd-metrics');

/**
 * Actions bar for inbox threads list
 *
 * @class  pages/mail/threads-list/inbox/actions-bar
 */
module.exports = ListActionsBarComponent.extend({
	section: 'inbox',

	template: _.template(template),

	getTemplateHelpers: function() {
		return _.assignIn({}, ListActionsBarComponent.prototype.getTemplateHelpers.call(this), {
			onArchiveClick: _.bind(this.moveSelectedThreadsToArchive, this),
			onDeleteClick: _.bind(this.onDeleteClick, this)
		});
	},

	initializeDropMenus: function() {
		ListActionsBarComponent.prototype.initializeDropMenus.call(this);

		this.initMarkAllDropMenu();
	},

	initMarkAllDropMenu: function() {
		this.markAllDropMenu = new DropMenu({
			target: this.$('.markAll .mark'),
			ui: 'arrowDropmenu',
			getContentOnOpen: true,
			onOpen: _.bind(function(d, dropMenuCallback) {
				d.config.data = this.getMarkAllDropMenuData();
				dropMenuCallback();
			}, this)
		});
	},

	getMarkAllDropMenuData: function() {
		const unreadMailCount = User.counts.getUnreadMailCount();

		return [
			{
				title: _.gettext('Mark all as read'),
				// markAllAsRead mail count is limited to 5000 emails
				click:
					!!unreadMailCount && unreadMailCount < 5000
						? _.bind(this.onMarkAllOptionClick, this, true)
						: null
			}
		];
	},

	onMarkAllOptionClick: function() {
		const unreadMailCount = User.counts.getUnreadMailCount();

		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
			'mail-v2.feature': 'threads-list',
			'mail-v2.param.folder': 'inbox',
			'mail-v2.action': 'mark-all-as-read',
			'mail-v2.param.count': unreadMailCount
		});

		this.threadsCollection.bulkEdit.markAllAsRead(
			'inbox',
			_.bind(function() {
				this.threadsCollection.markAllThreadsAsRead();
				this.showAllMarkedAsReadSnack(unreadMailCount);
			}, this)
		);
	},

	showAllMarkedAsReadSnack: function(unreadCount) {
		snackbar.show({
			text: _.gettext(
				_.ngettext(
					'%d conversation has been marked as read',
					'%d conversations have been marked as read',
					unreadCount
				),
				unreadCount
			)
		});
	},

	moveSelectedThreadsToArchive: function() {
		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
			'mail-v2.feature': 'threads-list',
			'mail-v2.param.folder': 'inbox',
			'mail-v2.action': 'bulk-move-to',
			'mail-v2.param.destin': 'archive',
			'mail-v2.param.count': this.threadsCollection.getSelectedModels().length
		});

		this.threadsCollection.toggleArchiveFlagOnSelectedThreads.call(
			this.threadsCollection,
			true,
			this.loadItems.bind(this)
		);

		const selectedCount = this.threadsCollection.selectedIds.length;

		snackbar.show({
			text: _.gettext(
				_.ngettext(
					'%d conversation has been archived',
					'%d conversations have been archived',
					selectedCount
				),
				selectedCount
			)
		});
	}
});
