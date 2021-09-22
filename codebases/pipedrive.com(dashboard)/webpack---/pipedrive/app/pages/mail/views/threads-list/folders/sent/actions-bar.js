const ListActionsBarComponent = require('../../../../components/list-actions-bar/list-actions-bar');
const _ = require('lodash');
const template = require('./actions-bar.html');

/**
 * Actions bar for sent folder threads list
 *
 * @class  pages/mail/threads-list/sent/actions-bar
 */
module.exports = ListActionsBarComponent.extend({
	section: 'sent',

	template: _.template(template),

	getTemplateHelpers: function() {
		return _.assignIn({}, ListActionsBarComponent.prototype.getTemplateHelpers.call(this), {
			onDeleteClick: _.bind(this.onDeleteClick, this)
		});
	}
});
