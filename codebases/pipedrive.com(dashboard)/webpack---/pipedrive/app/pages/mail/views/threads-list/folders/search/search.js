const BaseFolder = require('../base-folder');
const _ = require('lodash');
const ActionsBar = require('./actions-bar');
const PDMetrics = require('utils/pd-metrics');

module.exports = BaseFolder.extend({
	section: 'search',

	sectionTitle: _.gettext('Search'),

	events: _.assignIn({}, BaseFolder.prototype.events, {
		'click td:not(.selectRowInput)': 'sendResultSelectionMetrics'
	}),

	initActionsBarView: function() {
		this.actionsBarView = new ActionsBar({ collectionStack: this.options.collectionStack });
	},

	sendResultSelectionMetrics: function() {
		const collection = this.threadsCollection;
		const searchedBy = collection.getPartyData('partyId') ? 'party-id' : 'keyword';
		const count = _.get(collection.additionalData, 'pagination.count');
		const metricsData = {
			'mail-v2.feature': 'email-search',
			'mail-v2.action': 'item-select',
			'mail-v2.param.where': 'results-list',
			'mail-v2.param.character-count': collection.metricsKeywordLength,
			'mail-v2.param.searched-by': searchedBy,
			'mail-v2.param.list-results-count': count
		};

		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', metricsData);
	}
});
