const BaseFolder = require('../base-folder');
const _ = require('lodash');
const ActionsBar = require('./actions-bar');

/**
 * Drafts folder view.
 */
module.exports = BaseFolder.extend({
	section: 'drafts',

	sectionTitle: _.gettext('Drafts'),

	bindEvents: function() {
		this.listenTo(this.threadsCollection, 'sync add remove', this.updatePageTitle);
	},

	onLoad: function() {
		this.bindEvents();
		BaseFolder.prototype.onLoad.call(this);
	},

	initActionsBarView: function() {
		this.actionsBarView = new ActionsBar({ collectionStack: this.options.collectionStack });
	},

	updatePageTitle: function() {
		this.titleCounter = this.threadsCollection.getCount();
		this.setPageTitle();
	}
});
