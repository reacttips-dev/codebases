const Pipedrive = require('pipedrive');
const OrganizationModel = require('models/organization');

module.exports = Pipedrive.Collection.extend(
	{
		model: OrganizationModel,
		type: 'organization',
		url: `${app.config.api}/organizations`
	},
	{
		getListApiEndpoint: function() {
			return '/organizations/list';
		},

		includeFields: function(fields) {
			const result = ['name'];

			if (fields.indexOf('next_activity_date') !== -1) {
				result.push('next_activity_time');
			}

			if (fields.indexOf('last_activity_date') !== -1) {
				result.push('last_activity_time');
			}

			return result;
		}
	}
);
