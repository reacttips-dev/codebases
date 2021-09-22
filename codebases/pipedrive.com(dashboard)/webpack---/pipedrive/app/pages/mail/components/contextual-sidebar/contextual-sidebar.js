const ServiceLoader = require('components/service-loader/index');
const _ = require('lodash');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const WebappApi = require('webapp-api/index');

module.exports = ServiceLoader.extend({
	component: 'email-components:contextual-sidebar',
	serviceName: 'email-components-service-contextual-sidebar',

	initialize: function(options, ...args) {
		this.options = options || {};
		this.threadModel = this.options.thread;
		ServiceLoader.prototype.initialize.apply(this, args);
	},

	renderPage: async function(servicePage, element) {
		this.servicePage = await servicePage({
			el: element,
			api: new WebappApi(),
			threadModel: this.threadModel,
			mailConnections: MailConnections,
			viewPath: window.location.pathname
		});

		app.router.on('route', () => {
			const newPath = window.location.pathname;

			this.servicePage.route(newPath);
		});
	},

	onUnload: function() {
		if (this.servicePage) {
			this.servicePage.unmount();
		}
	},

	getErrorMessage: function() {
		return _.gettext('Contextual sidebar temporarily unavailable');
	}
});
