const ListActionsBarComponent = require('../../../../components/list-actions-bar/list-actions-bar');
const _ = require('lodash');
const snackbar = require('snackbars');
const template = require('./actions-bar.html');
const PDMetrics = require('utils/pd-metrics');

/**
 * Actions bar for archive threads list
 *
 * @class  pages/mail/threads-list/inbox/actions-bar
 */
module.exports = ListActionsBarComponent.extend({
	section: 'archive',

	template: _.template(template),

	getTemplateHelpers: function() {
		return _.assignIn({}, ListActionsBarComponent.prototype.getTemplateHelpers.call(this), {
			onMoveToInboxClick: _.bind(this.moveSelectedThreadsToInbox, this),
			onDeleteClick: _.bind(this.onDeleteClick, this)
		});
	},

	moveSelectedThreadsToInbox: function() {
		const selectedItemsCount = this.threadsCollection.getSelectedModels().length;

		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
			'mail-v2.feature': 'threads-list',
			'mail-v2.param.folder': 'archive',
			'mail-v2.action': 'bulk-move-to',
			'mail-v2.param.destin': 'inbox',
			'mail-v2.param.count': selectedItemsCount
		});

		this.threadsCollection.toggleArchiveFlagOnSelectedThreads.call(
			this.threadsCollection,
			false,
			this.loadItems.bind(this)
		);

		snackbar.show({
			text: _.gettext(
				_.ngettext(
					'%d conversation has been moved to Inbox',
					'%d conversations have been moved to Inbox',
					selectedItemsCount
				),
				selectedItemsCount
			)
		});
	}
});
