module.exports = function(API, params, tag) {
	let calendarSyncTeaser;

	const calendarSyncTeaserCoachmark = new API.Coachmark({
		tag,
		onReady: function(data) {
			if (!data.active) {
				return;
			}

			calendarSyncTeaser = new params.view({
				coachmark: calendarSyncTeaserCoachmark,
				coachmarkContainer: params.coachmarkContainer,
				adjustContentLocation: params.adjustContentLocation
			});

			calendarSyncTeaser.render();
		}
	});

	return calendarSyncTeaserCoachmark;
};
