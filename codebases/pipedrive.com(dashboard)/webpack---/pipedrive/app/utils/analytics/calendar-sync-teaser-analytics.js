'use strict';
const User = require('models/user');
const PDMetrics = require('utils/pd-metrics');

const getSource = () => {
	const activitiesViewMode = User.settings.get('activities_view_mode');

	return activitiesViewMode === 'calendar' ? 'activity_calendar_view' : 'activity_list_view';
};

module.exports.trackCalendarSyncTeaserClicked = () => {
	PDMetrics.trackUsage(null, 'calendarsync_teaser', 'clicked', {
		source: getSource()
	});
};

module.exports.trackCalendarSyncTeaserClosed = () => {
	PDMetrics.trackUsage(null, 'calendarsync_teaser', 'closed', {
		source: getSource()
	});
};
