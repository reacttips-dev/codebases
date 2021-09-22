const _ = require('lodash');

const sendCampaignButton = function(API, parent, tag) {
	const coachmark = new API.Coachmark({
		tag,
		parent,
		content: _.gettext(
			'After you have marked contacts as subcribers, you can send email campaigns directly from here'
		),
		appearance: {
			placement: 'bottomRight',
			zIndex: 12,
			width: 320
		},
		__debug: false
	});

	return coachmark;
};

const editMarketingColumn = function(API, parent, tag, options) {
	const coachmark = new API.Coachmark({
		tag,
		parent,
		content: _.gettext(
			"The contact marketing status field allows you to keep track of your customers' marketing  consent"
		),
		appearance: {
			placement: 'top',
			zIndex: 12,
			width: 380
		},
		parentContainer: options.parentContainer || null,
		onSeen: function() {
			options.onSeen('PROMOTE_MARKETING_CAMPAIGN');
		},
		detached: true,
		__debug: false
	});

	return coachmark;
};

const bulkEditMarketingStatus = function(API, parent, tag) {
	const coachmark = new API.Coachmark({
		tag,
		parent,
		content: _.gettext('You can bulk edit your contacts marketing status (eg. subscribed)'),
		appearance: {
			placement: 'left',
			zIndex: 999,
			width: 256
		},
		detached: true,
		__debug: false
	});

	return coachmark;
};

exports.sendCampaignButton = sendCampaignButton;
exports.editMarketingColumn = editMarketingColumn;
exports.bulkEditMarketingStatus = bulkEditMarketingStatus;
