const ServiceLoader = require('components/service-loader/index');
const WebappApi = require('webapp-api/index');
const _ = require('lodash');

module.exports = ServiceLoader.extend({
	component: 'email-components:schedule-email',
	serviceName: 'email-components-schedule-email',
	template: _.template('<div class="servicePage"></div>'),

	initialize: function(options) {
		this.sendMail = options.sendMail;

		ServiceLoader.prototype.initialize.call(this, options);
	},

	renderPage: async function(servicePage, element) {
		this.servicePage = await servicePage({
			el: element,
			API: new WebappApi(),
			sendMail: this.sendMail
		});
	},

	onUnload: function() {
		if (this.servicePage) {
			this.servicePage.unmount();
		}
	},

	getErrorMessage: function() {
		return _.gettext('Scheduling emails is temporarily unavailable');
	}
});
