const ServiceLoader = require('components/service-loader/index');
const WebappApi = require('webapp-api/index');

module.exports = ServiceLoader.extend({
	component: 'sales-phone-client:dialler',
	serviceName: 'Sales Phone',

	initialize: function(options) {
		this.options = options || {};

		ServiceLoader.prototype.initialize.apply(this);
	},

	renderPage: function(ServicePage) {
		this.servicePage = new ServicePage({
			...this.options,
			api: new WebappApi()
		});
	},

	route: function(path) {
		this.servicePage.route(path);
	}
});
