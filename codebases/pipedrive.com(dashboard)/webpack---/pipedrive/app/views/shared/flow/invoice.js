const ServiceLoader = require('components/service-loader/index');
const _ = require('lodash');

module.exports = ServiceLoader.extend({
	component: 'invoice-ui',
	serviceName: 'Invoice flow item',

	initialize: function(options) {
		this.options = options;

		ServiceLoader.prototype.initialize.apply(this, options);
	},

	route: function(path) {
		this.servicePage.route(path);
	},

	getErrorMessage: function() {
		return _.gettext('Invoice flow item temporarily unavailable');
	},

	getMicroFEProps() {
		const { model, relatedModel, onRender } = this.options;

		return {
			invoiceModel: model,
			dealModel: relatedModel,
			onRender,
			view: 'invoice-flow-item'
		};
	}
});
