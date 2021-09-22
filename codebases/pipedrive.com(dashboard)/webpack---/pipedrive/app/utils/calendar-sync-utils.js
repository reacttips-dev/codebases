const User = require('models/user');

let hasActiveCalendarSync = null;

const checkSync = async (url) => {
	const response = await fetch(url);

	// Don't show teaser (!true)
	// if we cannot determine if user has sync before
	if (!response.ok) {
		return true;
	}

	const { hadEverBeenActivated } = await response.json();

	return !!hadEverBeenActivated;
};

const checkActiveSync = async (url) => {
	const response = await fetch(url);

	// Don't show specific dialog
	// if we cannot determine if user has active sync
	if (!response.ok) {
		return false;
	}

	// API response with 204 NO CONTENT when no account found
	const { status } = response.status === 204 ? {} : await response.json();

	return (hasActiveCalendarSync = status === 'active');
};

const hasNylasOrFastisCalendarSyncEnabled = () => {
	return User.companyFeatures.get('nylas_calendar_sync') || User.companyFeatures.get('fastis');
};

module.exports = {
	checkSync,
	checkActiveSync,
	hasNylasOrFastisCalendarSyncEnabled,
	hasHadActiveCalendarSync: async function() {
		const results = await Promise.all([
			checkSync('/api/calendar-sync/v1/accounts/sync/had-ever-been-activated'),
			checkSync('/api/v1/fastis/sync/hadEverBeenActivated')
		]);

		return results.some(Boolean);
	},
	hasActiveCalendarSync: async function(useCache = true) {
		if (hasActiveCalendarSync !== null && useCache) {
			return hasActiveCalendarSync;
		}

		if (!hasNylasOrFastisCalendarSyncEnabled()) {
			return false;
		}

		const results = await Promise.all([
			checkActiveSync('/api/calendar-sync/v1/accounts/sync/active'),
			checkActiveSync('/api/v1/fastis/sync/active')
		]);

		return results.some(Boolean);
	},
	isSyncedActivityType: function(activityType) {
		const ignoredActivityTypes = User.settings.get('calendar_sync_ignore_activity_types');

		return !ignoredActivityTypes || !ignoredActivityTypes.includes(activityType);
	}
};
