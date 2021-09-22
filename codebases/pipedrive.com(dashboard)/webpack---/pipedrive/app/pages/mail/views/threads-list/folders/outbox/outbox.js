const ServiceLoader = require('components/service-loader/index');
const WebappApi = require('webapp-api/index');
const _ = require('lodash');
const Helpers = require('utils/helpers');

module.exports = ServiceLoader.extend({
	component: 'email-components:outbox',
	serviceName: 'email-components-outbox',

	renderPage: async function(servicePage, element) {
		this.servicePage = await servicePage({
			el: element,
			API: new WebappApi()
		});
	},

	onFocus: function() {
		Helpers.title.set(`${_.gettext('Outbox')} - ${_.gettext('Mail')}`);
	},

	onUnload: function() {
		if (this.servicePage) {
			this.servicePage.unmount();
		}
	},

	getErrorMessage: function() {
		return _.gettext('Email outbox temporarily unavailable');
	},

	onActiveNavItemClick: function() {
		this.callServicePageMethod('onActiveNavItemClick');
	}
});
