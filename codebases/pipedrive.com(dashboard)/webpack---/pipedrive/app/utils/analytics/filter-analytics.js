'use strict';

const PDMetrics = require('utils/pd-metrics');

const filterSelected = function(options) {
	PDMetrics.trackUsage(null, 'filter_component', 'select', {
		filter_type: options.type,
		filter_value: options.value
	});
};
const trackFilterModalUsage = function(screen, resolution, timeOpenMs, filter) {
	const context = {
		screen,
		resolution,
		time_open_ms: timeOpenMs
	};

	if (filter) {
		Object.assign(context, {
			filter_id: filter.get('id'),
			include_columns: filter.get('custom_view_id') !== null,
			visible: filter.get('visible_to') === '1' ? 'private' : 'shared'
		});
	}

	PDMetrics.trackUsage(null, 'filter_edit_component', 'used', context);
};

module.exports = function() {
	app.global.bind('track.filter.modal.select', filterSelected);
	app.global.bind('track.filter.modal.usage', trackFilterModalUsage);
};
