const ListActionsBarComponent = require('../../../../components/list-actions-bar/list-actions-bar');
const _ = require('lodash');
const template = require('./actions-bar.html');

/**
 * Actions bar for inbox threads list
 *
 * @class  pages/mail/threads-list/inbox/actions-bar
 */
module.exports = ListActionsBarComponent.extend({
	section: 'drafts',

	template: _.template(template),

	getTemplateHelpers: function() {
		return _.assignIn({}, ListActionsBarComponent.prototype.getTemplateHelpers.call(this), {
			onDiscardDraftClicked: _.bind(this.onDiscardDraftClicked, this)
		});
	},

	onDiscardDraftClicked: function() {
		if (window.confirm(this.getDiscardDraftsConfirmation())) {
			this.threadsCollection.discardDraftsOnSelectedThreads();
		}
	},

	getDiscardDraftsConfirmation: function() {
		return _.gettext(
			_.ngettext(
				'Are you sure you want to discard %d draft? You can’t undo this action.',
				'Are you sure you want to discard %d drafts? You can’t undo this action.',
				this.threadsCollection.selectedIds.length
			),
			this.threadsCollection.selectedIds.length
		);
	}
});
