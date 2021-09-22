export const reauthSettingName = 'nylas_calendar_sync_reauth_progress';

export const isWarningVisible = (userSettings, nylasSync = true) =>
	userSettings.get('show_calendar_sync_reauthentication_warning') ||
	(userSettings.get('show_calendar_sync_soft_reauthentication_warning') && nylasSync);

export const isReauthModalVisible = (userSettings) =>
	userSettings.get(reauthSettingName) === 'show_reauth_modal' &&
	userSettings.get('show_calendar_sync_soft_reauthentication_warning');

export const isReauthBannerVisible = (userSettings) =>
	['show_reauth_modal', 'awaiting_reauth'].includes(userSettings.get(reauthSettingName)) &&
	userSettings.get('show_calendar_sync_soft_reauthentication_warning');

export const getDaysRemaining = () => {
	const today = new Date();
	const endDate = new Date('07/19/2021'); // hardcoded end date for reauth
	const timeDifference = endDate.getTime() - today.getTime();

	const daysDifference = () => {
		const diff = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

		if (diff < 0) {
			return 0;
		}

		return diff;
	};

	return daysDifference();
};

export const getMessage = (type, translator) => {
	const days = getDaysRemaining();
	const messages = {
		reauth: `${translator.gettext(`
			You have
			${days}
			${translator.ngettext('day', 'days', days)}
			left to re-authenticate your calendar sync credentials.`)}`,
	};

	return messages[type];
};

const getBannerItems = (userSettings, translator) => {
	if (userSettings.get('show_calendar_sync_reauthentication_warning')) {
		return {
			warningText: translator.gettext(
				`There was a problem connecting to your Calendar sync provider.
					This could be due to a change in your credentials or server settings.
					[Update sync settings][calendar-settings-page].`,
			),
			closable: true,
		};
	} else if (
		['show_reauth_modal', 'awaiting_reauth'].includes(userSettings.get(reauthSettingName))
	) {
		return {
			warningText: `${getMessage(
				'reauth',
				translator,
			)} [Re-authenticate now][calendar-settings-page] or [learn more][open-reauth-modal].`,
		};
	} else if (userSettings.get('show_calendar_sync_soft_reauthentication_warning')) {
		return {
			warningText: translator.gettext(
				`You’ll need to re-authenticate your account for the new calendar sync update soon.
					If you do it already now, we can migrate you without any disruptions when the time comes.
					[Authenticate now][calendar-settings-page].`,
			),
		};
	}

	return {};
};

export default getBannerItems;
