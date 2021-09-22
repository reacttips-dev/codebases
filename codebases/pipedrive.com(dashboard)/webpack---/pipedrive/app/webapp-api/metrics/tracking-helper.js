const Logger = require('@pipedrive/logger-fe').default;
const calendarSync = require('../../utils/calendar-sync-utils');

const logger = new Logger('utils', 'tracking');

let helpers;

async function hasActiveNylasCalendarSync(user) {
	try {
		if (user.companyFeatures.get('nylas_calendar_sync')) {
			return await calendarSync.checkActiveSync('/api/calendar-sync/v1/accounts/sync/active');
		}
	} catch (error) {
		logger.error(error, 'nylas calendar not synced');
	}

	return false;
}

async function hasActiveFastisSync(user) {
	try {
		if (user.companyFeatures.get('fastis')) {
			return await calendarSync.checkActiveSync('/api/v1/fastis/sync/active');
		}
	} catch (error) {
		logger.error(error, 'fastis calendar not synced');
	}

	return false;
}

function hasActiveEmailSync(mailConnections) {
	return mailConnections.hasActiveNylasConnection();
}

function getSyncProvider(mailConnections) {
	return mailConnections.getSyncProvider();
}

function googleDriveEnabled(user) {
	return (
		user.companyFeatures.get('google_drive') &&
		user.settings.get('file_upload_destination') === 'googledocs'
	);
}

function googleCalSyncEnabled(user) {
	return user.companyFeatures.get('gcal') && user.settings.get('google_calendar_sync');
}

function userSettingEnabled(key, user) {
	return user.settings.get(key);
}

async function getUserActivatedFeatures(user, mailConnections) {
	const isNylasCalendarSynced = await helpers.hasActiveNylasCalendarSync(user);
	const isOnFastisCalendarSync = await helpers.hasActiveFastisSync(user);
	const isActiveEmailSync = helpers.hasActiveEmailSync(mailConnections);
	const syncProvider = helpers.getSyncProvider(mailConnections);
	const isPipemailerEmailSyncOn = syncProvider === 'pipemailer';
	const isNylasEmailSyncOn = syncProvider === 'nylas';

	const properties = [
		{
			label: 'google_drive',
			check: helpers.googleDriveEnabled(user)
		},
		{
			label: 'email_sync',
			check: isActiveEmailSync
		},
		{
			label: 'pipemailer_email_sync',
			check: isActiveEmailSync && isPipemailerEmailSyncOn
		},
		{
			label: 'nylas_email_sync',
			check: isActiveEmailSync && isNylasEmailSyncOn
		},
		{
			label: 'fastis_calendar_sync',
			check: isOnFastisCalendarSync
		},
		{
			label: 'nylas_calendar_sync',
			check: isNylasCalendarSynced
		},
		{
			label: 'gcal_sync',
			check: helpers.googleCalSyncEnabled(user)
		},
		{
			label: 'smart_contact_data',
			check: helpers.userSettingEnabled('superdata', user)
		}
	];

	return properties.filter((prop) => prop.check).map((prop) => prop.label);
}

async function getUserSettings(user) {
	return {
		deal_details_open: !!user.settings.get('open_details_after_adding_deal'),
		person_details_open: !!user.settings.get('open_details_after_adding_person'),
		organization_details_open: !!user.settings.get('open_details_after_adding_organization'),
		convert_currencies: !!user.settings.get('totals_convert_currency'),
		format_phone_numbers: !!user.settings.get('format_phone_numbers_enabled'),
		open_email_links_in_new_tab: !!user.settings.get('open_email_links_in_new_tab'),
		activity_email_reminders: !!user.settings.get('activity_email_reminders'),
		activity_email_reminders_time: user.settings.get('activity_email_reminders_send_type'),
		activity_email_reminders_separately: !!user.settings.get(
			'activity_email_reminders_send_separately'
		),
		activity_email_reminders_immediately: !!user.settings.get('send_reminders_same_day'),
		desktop_notifications: !!user.settings.get('show_update_notifications')
	};
}

helpers = {
	hasActiveNylasCalendarSync,
	hasActiveFastisSync,
	hasActiveEmailSync,
	getSyncProvider,
	googleDriveEnabled,
	googleCalSyncEnabled,
	getUserActivatedFeatures,
	userSettingEnabled,
	getUserSettings
};

module.exports = helpers;
