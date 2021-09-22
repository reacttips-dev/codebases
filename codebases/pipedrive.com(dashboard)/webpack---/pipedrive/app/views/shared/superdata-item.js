const ReactDOM = require('react-dom');
const ServiceLoader = require('components/service-loader/index');
const _ = require('lodash');

module.exports = ServiceLoader.extend({
	component: 'superdata-assets',
	serviceName: 'Superdata service',
	model: null,

	initialize: function(options) {
		this.options = options || {};
		this.type = this.options.type;
		ServiceLoader.prototype.initialize.apply(this, this.options);
	},

	route: function(path) {
		this.servicePage.route(path);
	},

	getErrorMessage: function() {
		return _.gettext('Superdata temporarily unavailable');
	},

	getMicroFEProps() {
		const { model, type } = this.options;

		return {
			model: model.attributes,
			type
		};
	},

	onDestroy: function() {
		if (this.el) {
			ReactDOM.unmountComponentAtNode(this.el);
		}
	}
});
