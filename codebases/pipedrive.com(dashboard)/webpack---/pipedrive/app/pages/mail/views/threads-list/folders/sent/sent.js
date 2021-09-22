const BaseFolder = require('../base-folder');
const _ = require('lodash');
const ActionsBar = require('./actions-bar');

/**
 * Sent folder view.
 */
module.exports = BaseFolder.extend({
	section: 'sent',

	sectionTitle: _.gettext('Sent'),

	initActionsBarView: function() {
		this.actionsBarView = new ActionsBar({ collectionStack: this.options.collectionStack });
	}
});
