const PDMetrics = require('utils/pd-metrics');

module.exports = function(API, params, tag) {
	const { mountNode, onHide, companySize, userMotive, cb } = params;

	const gettingStartedV2Coachmark = new API.Coachmark({
		tag,
		onReady: function() {
			const iamGettingStartedV2 = new API.GettingStartedV2({
				parent: mountNode,
				appearance: {
					zIndex: {
						above: '#mainmenu'
					},
					zIndexCollapsed: {
						above: '#pipelineContainer, .gridContent'
					}
				},
				onHide: function() {
					gettingStartedV2Coachmark.close();

					if (onHide) {
						onHide();
					}
				},
				companySize,
				userMotive
			});

			PDMetrics.trackUsage(null, 'getting_started', 'opened', {
				type: 'pushed_by_system'
			});

			cb(iamGettingStartedV2);
		}
	});

	return gettingStartedV2Coachmark;
};
