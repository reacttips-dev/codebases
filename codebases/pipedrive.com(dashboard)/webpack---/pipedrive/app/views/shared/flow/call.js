const ServiceLoader = require('components/service-loader/index');
const WebappApi = require('webapp-api/index');
const ActivityModel = require('models/activity');

module.exports = ServiceLoader.extend({
	component: 'sales-phone-client:flow-item',
	serviceName: 'Sales Phone',

	initialize: function(options) {
		this.options = options || {};
		ServiceLoader.prototype.initialize.apply(this, options);
	},

	renderPage: function(ServicePage, element) {
		const { model, relatedModel, salesPhoneModel, onRender } = this.options;

		this.servicePage = new ServicePage({
			el: element,
			api: new WebappApi(),
			activityModel: model,
			dealModel: relatedModel,
			salesPhoneSubaccountModel: salesPhoneModel,
			onRender,
			onUpdate: (data) =>
				app.global.fire(`activity.model.${data.id}.update`, new ActivityModel(data))
		});
	},

	route: function(path) {
		this.servicePage.route(path);
	}
});
