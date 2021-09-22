const { get } = require('@pipedrive/fetch');
const User = require('models/user');
const Logger = require('utils/logger');
const logger = new Logger(`utils`, 'conference-meeting-utils');

let conferenceMeetingIntegrations = null;

module.exports = {
	isConferenceLinkEnabled: function(features) {
		return (
			features &&
			(features.get('meeting_integration_zoom') || features.get('ms_teams_integration'))
		);
	},
	getInstalledVideoCallApps: async function() {
		try {
			const { data: integrations } = await get(
				'/api/v1/meeting-api/meetings/integrations/installed',
				{
					queryParams: {
						language: User.getLanguage ? User.getLanguage() : 'en-US'
					}
				}
			);

			return integrations;
		} catch (error) {
			logger.warn(error, 'Could not get installed video-call apps');

			return [];
		}
	},
	getCachedInstalledVideoCallApps: async function() {
		if (conferenceMeetingIntegrations !== null) {
			return conferenceMeetingIntegrations;
		}

		try {
			const installedVideoCallApps = await this.getInstalledVideoCallApps();

			conferenceMeetingIntegrations = installedVideoCallApps;

			return installedVideoCallApps;
		} catch (err) {
			conferenceMeetingIntegrations = null;

			return [];
		}
	}
};
