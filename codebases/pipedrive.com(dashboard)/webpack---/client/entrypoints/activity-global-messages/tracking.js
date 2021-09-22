const getSource = (userSelf) => {
	return userSelf.settings.get('activities_view_mode') === 'calendar'
		? 'activity_calendar_view'
		: 'activity_list_view';
};

const getWarningType = (userSelf, isCountdownBanner = false) => {
	if (isCountdownBanner) return 'countdown';

	const isReauthModal = userSelf.settings.get('nylas_calendar_sync_reauth_progress');

	if (isReauthModal) return 'pop_up';

	const isSoftReauth = userSelf.settings.get('show_calendar_sync_soft_reauthentication_warning');

	if (isSoftReauth) return 'soft_reauth';

	return 'reauth';
};

export const trackCalendarSyncReauthWarningSeen = ({ userSelf, pdMetrics }) => {
	pdMetrics.trackUsage(null, 'calendarsync_reauth_warning', 'seen', {
		source: getSource(userSelf),
		warning_type: getWarningType(userSelf),
	});
};

export const trackCalendarSyncReauthWarningClicked = (
	{ userSelf, pdMetrics },
	isCountdownBanner = false,
) => {
	pdMetrics.trackUsage(null, 'calendarsync_reauth_warning', 'clicked', {
		source: getSource(userSelf),
		warning_type: getWarningType(userSelf, isCountdownBanner),
	});
};

export const trackCalendarSyncReauthWarningClosed = ({ userSelf, pdMetrics }) => {
	pdMetrics.trackUsage(null, 'calendarsync_reauth_warning', 'closed', {
		source: getSource(userSelf),
	});
};
