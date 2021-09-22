module.exports = function(API, params, tag) {
	let customFieldsBanner;

	const customFieldsCoachmark = new API.Coachmark({
		tag,
		onReady: function() {
			customFieldsBanner = new params.view({
				coachmark: customFieldsCoachmark,
				settingsTab: params.settingsTab,
				parentType: params.parentType
			});

			customFieldsBanner.render();
		},
		onChange: function(state) {
			const $message = customFieldsBanner.$('.cui4-message');

			// Same animation logic as CUI4
			if (state.active) {
				$message.css({
					height: $message.height()
				});
			} else {
				$message.css({
					height: 0
				});
				$message.removeClass('cui4-message--visible');

				setTimeout(() => {
					customFieldsBanner.remove();
				}, 200);
			}
		}
	});

	return customFieldsCoachmark;
};
