const User = require('models/user');

module.exports = function(API, params, tag) {
	const insightsFeatureEnabled = User.companyFeatures.get('insights');

	if (!insightsFeatureEnabled) {
		return;
	}

	let insightsMessage;

	const insightsMessageCoachmark = new API.Coachmark({
		tag,
		onReady: function() {
			insightsMessage = new params.view({
				coachmark: insightsMessageCoachmark,
				coachmarkContainer: params.coachmarkContainer,
				parentType: params.parentType
			});

			insightsMessage.render();
		},
		onChange: function(state) {
			if (!state.active) {
				insightsMessage.remove();
			}
		}
	});

	return insightsMessageCoachmark;
};
