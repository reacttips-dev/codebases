const PDMetrics = require('utils/pd-metrics');

function getAlphabetFilterAppliedMetrics(filterApplied, listSettings) {
	return {
		list_view_type: listSettings.collection.type,
		filter_applied: filterApplied,
		result_count: listSettings.getSummary().attributes.total_count
	};
}

module.exports = {
	trackAlphabetFilterApplied: function(appliedFilter, listSettings) {
		listSettings.getSummary().once('sync', () => {
			const attributes = getAlphabetFilterAppliedMetrics(appliedFilter, listSettings);

			PDMetrics.trackUsage(null, 'alphabet_filter', 'applied', attributes);
		});
	}
};
