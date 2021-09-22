const ServiceLoader = require('components/service-loader/index');
const _ = require('lodash');

module.exports = ServiceLoader.extend({
	component: 'invoice-ui',
	serviceName: 'Invoice form view',

	initialize: function(options) {
		this.options = options;

		ServiceLoader.prototype.initialize.apply(this, options);
	},

	route: function(path) {
		this.servicePage.route(path);
	},

	getErrorMessage: function() {
		return _.gettext('Invoice creation temporarily unavailable');
	},

	getMicroFEProps() {
		const { closeCompose, relatedModel, onRender } = this.options;

		return {
			dealModel: relatedModel,
			onRender,
			closeCompose,
			view: 'invoice-form'
		};
	}
});
