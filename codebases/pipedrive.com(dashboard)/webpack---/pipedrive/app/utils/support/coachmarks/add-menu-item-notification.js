const User = require('models/user');

module.exports = function(API, params, tag) {
	const insightsFeatureEnabled = User.companyFeatures.get('insights');

	if (!insightsFeatureEnabled) {
		return;
	}

	let addNotification;

	const addMenuItemCoachmark = new API.Coachmark({
		tag,
		onReady: function() {
			addNotification = new params.view({
				coachmark: addMenuItemCoachmark,
				coachmarkContainer: params.coachmarkContainer
			});

			addNotification.render();
		},
		onChange: function(state) {
			if (!state.active) {
				addNotification.remove();
			}
		}
	});

	return addMenuItemCoachmark;
};
