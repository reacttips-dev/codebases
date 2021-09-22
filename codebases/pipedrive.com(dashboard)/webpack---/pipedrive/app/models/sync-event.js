const Pipedrive = require('pipedrive');

module.exports = Pipedrive.Model.extend({
	getSyncEventData: function(response) {
		// eslint-disable-next-line prefer-rest-params
		const eventData = Pipedrive.Model.prototype.getSyncEventData.apply(this, arguments);

		if (response.additional_data && response.additional_data.matches_filters) {
			eventData.meta.matches_filters = response.additional_data.matches_filters;

			if (!response.additional_data.matches_filters.current) {
				eventData.meta.matches_filters = {
					current: response.additional_data.matches_filters
				};
			}
		}

		return eventData;
	}
});
