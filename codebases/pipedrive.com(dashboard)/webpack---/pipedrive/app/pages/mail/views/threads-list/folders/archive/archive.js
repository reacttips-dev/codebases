const BaseFolder = require('../base-folder');
const _ = require('lodash');
const ActionsBar = require('./actions-bar');

/**
 * Archive folder view.
 */
module.exports = BaseFolder.extend({
	section: 'archive',

	sectionTitle: _.pgettext('Noun', 'Archive'),

	initActionsBarView: function() {
		this.actionsBarView = new ActionsBar({ collectionStack: this.options.collectionStack });
	}
});
