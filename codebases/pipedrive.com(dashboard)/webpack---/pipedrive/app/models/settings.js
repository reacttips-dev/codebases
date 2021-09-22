const { Model } = require('@pipedrive/webapp-core');
const MailSignature = require('models/mail/signature');
const UserSettings = Model.extend({
	url: function() {
		return '/api/v1/userSettings';
	},

	initialize: function() {
		this.setMailSignature();
	},

	parse: function(response) {
		return response.data;
	},

	setMailSignature: function() {
		this.mailSignature = new MailSignature({
			id: this.cid
		});
	},

	saveViewModeToUserSettings: function(viewKey, viewMode) {
		const viewModeKey = `${viewKey}_view_mode`;

		if (this.get(viewModeKey) !== viewMode) {
			const userSettingsViewMode = {};

			userSettingsViewMode[viewModeKey] = viewMode;

			this.set(userSettingsViewMode, { silent: true });
			this.save();
		}
	}
});

module.exports = UserSettings;
