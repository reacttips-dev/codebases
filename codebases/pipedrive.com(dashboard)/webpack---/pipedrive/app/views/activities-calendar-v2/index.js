const Pipedrive = require('pipedrive');
const User = require('models/user');
const _ = require('lodash');
const ServiceLoader = require('components/service-loader/index');
const WebappApi = require('webapp-api/index');
const logger = new Pipedrive.Logger('Activities Calendar v2.0', 'amd');

module.exports = ServiceLoader.extend({
	component: 'activities-components:calendar-view-page',
	serviceName: 'Activities calendar view v2.0',
	initialize: function(...args) {
		const self = this;

		self.afterLoadDialog = args[0]?.afterLoadDialog;

		const initializeService = function initializeService() {
			ServiceLoader.prototype.initialize.call(self, args);
			self.showAfterLoadDialog();
		};

		User.getUser((user) => {
			self.user = user;
			initializeService();
		}, _.ary(initializeService, 0));
	},

	onFocus: function() {
		if (!this.user) {
			return;
		}

		if (this.servicePage) {
			this.servicePage.render();
		}
	},

	showAfterLoadDialog: function() {
		const dialogDetails = this.afterLoadDialog;

		if (!dialogDetails) {
			return;
		}

		const params = Object.fromEntries(new URLSearchParams(location.search));

		app.router.go(null, location.hash, false, false, params);
	},

	renderPage: function(ServicePage, element) {
		this.servicePage = new ServicePage({
			el: element,
			filter: this.filter,
			api: new WebappApi(),
			calendarViewUrl: '/activities/calendar'
		});
		this.servicePage.render();
	},

	route: function(path) {
		logger.log('Route', path);
	},

	getErrorMessage: function() {
		return _.gettext('Activities Calendar temporarily unavailable');
	}
});
