const ServiceLoader = require('components/service-loader/index');
const _ = require('lodash');
const WebappApi = require('webapp-api/index');
const Helpers = require('utils/helpers');
const ActivityModel = require('models/activity');

module.exports = ServiceLoader.extend({
	component: 'sales-phone-client:flow-composer-bar',
	serviceName: 'Sales phone client flow composer',

	initialize: function(options) {
		this.options = options;
		ServiceLoader.prototype.initialize.apply(this, options);
	},

	activityCreatedCallback: function(data) {
		app.global.fire(`activity.model.${data.id}.update`, new ActivityModel(data));
	},

	renderPage: function(ServicePage, element) {
		const { relatedModel, onRender, closeCompose } = this.options;
		const diallerElement = document.getElementById('sales-phone-dialler');

		this.servicePage = new ServicePage({
			el: element,
			diallerElement,
			api: new WebappApi(),
			relatedModel,
			onRender,
			closeCompose,
			activityCreatedCallback: this.activityCreatedCallback,
			createPhoneLink: Helpers.createPhoneLink
		});
	},

	route: function(path) {
		this.servicePage.route(path);
	},

	getErrorMessage: function() {
		return _.gettext('Caller temporarily unavailable');
	}
});
