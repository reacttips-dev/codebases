const _ = require('lodash');

exports.mailSettingsButton = function(API, parent, tag) {
	const coachmark = new API.Coachmark({
		tag,
		parent,
		content: _.gettext('You can edit the sender name in Email settings'),
		appearance: {
			placement: 'left',
			zIndex: 10
		},
		__debug: false
	});

	return coachmark;
};
