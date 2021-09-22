const ServiceLoader = require('components/service-loader/index');
const _ = require('lodash');

module.exports = ServiceLoader.extend({
	component: 'docbase-ui',
	serviceName: 'Document creation view',

	initialize: function(options) {
		this.options = options;

		ServiceLoader.prototype.initialize.apply(this, options);
	},

	route: function(path) {
		this.servicePage.route(path);
	},

	getMicroFEProps() {
		const { relatedModel, onRender, closeCompose } = this.options;

		return {
			dealModel: relatedModel,
			onRender,
			closeCompose,
			view: 'compose-document'
		};
	},

	getErrorMessage: function() {
		return _.gettext('Document creation temporarily unavailable');
	}
});
