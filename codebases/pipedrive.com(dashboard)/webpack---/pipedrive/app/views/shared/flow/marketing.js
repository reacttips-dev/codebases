const ServiceLoader = require('components/service-loader/index');
const _ = require('lodash');

module.exports = ServiceLoader.extend({
	component: 'marketing-ui:flowItem',
	serviceName: 'Marketing flow item view',

	initialize: function(options) {
		this.options = options;
		ServiceLoader.prototype.initialize.apply(this, options);
	},

	route: function(path) {
		this.servicePage.route(path);
	},

	getMicroFEProps() {
		const { model } = this.options;

		return model.toJSON();
	},

	getErrorMessage: function() {
		return _.gettext('Marketing flow item temporarily unavailable');
	}
});
