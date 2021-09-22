const User = require('models/user');
const _ = require('lodash');
const BaseFolder = require('../base-folder');
const ActionsBar = require('./actions-bar');

/**
 * Inbox folder view.
 */
module.exports = BaseFolder.extend({
	section: 'inbox',

	sectionTitle: _.gettext('Inbox'),

	titleCounter: User.counts.get('unread_mail_threads_inbox_count'),

	bindEvents: function() {
		this.listenTo(User.counts, 'change:unread_mail_threads_inbox_count', this.updatePageTitle);
	},

	onLoad: function() {
		this.bindEvents();
		BaseFolder.prototype.onLoad.call(this);
	},

	initActionsBarView: function() {
		this.actionsBarView = new ActionsBar({ collectionStack: this.options.collectionStack });
	},

	updatePageTitle: function() {
		this.titleCounter = User.counts.get('unread_mail_threads_inbox_count');
		this.setPageTitle();
	}
});
