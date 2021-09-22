const User = require('models/user');
const Currencies = require('collections/currencies');
const Stages = require('collections/pipeline/stages');
const NotificationSystem = require('views/ui/notifications');
const GlobalSocketMessagesHandler = require('components/global-socket-messages-handler/index');
const BillingDetails = require('models/billing-details');
const PDMetrics = require('utils/pd-metrics');
const activityAnalytics = require('utils/analytics/activity-analytics');
const filterAnalytics = require('utils/analytics/filter-analytics');
const bulkEditAnalytics = require('utils/analytics/bulk-edit-analytics');

require('whatwg-fetch');
require('views/ui/formitems');
require('jquery.tooltips-0.1');

module.exports = {
	// Initialize all different tools needed by app
	initialize: function() {
		// start singletons
		BillingDetails.initialPull();

		// Initialize custom analytics
		activityAnalytics();
		filterAnalytics();
		bulkEditAnalytics.init();

		Currencies.initialize(User.get('currencies'));
		Stages.initialize(User.get('stages'));
	},

	// Start to actually render stuff!
	start: function(SocketHandler) {
		// Initialize popup notifications
		new NotificationSystem(SocketHandler, {
			allMessages:
				User.settings.get('show_update_notifications') ||
				location.hash.match(/debug=notifications/)
		});

		// Initialize a handler for global socket messages
		GlobalSocketMessagesHandler.initialize(SocketHandler);

		PDMetrics.finished();
	}
};
