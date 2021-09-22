const ServiceLoader = require('components/service-loader/index');
const _ = require('lodash');

module.exports = ServiceLoader.extend({
	component: 'docbase-ui',
	serviceName: 'Document flow item view',

	initialize: function(options) {
		this.options = options;
		ServiceLoader.prototype.initialize.apply(this, options);
	},

	route: function(path) {
		this.servicePage.route(path);
	},

	getMicroFEProps() {
		const { model, relatedModel, onRender } = this.options;

		return {
			documentModel: model,
			dealModel: relatedModel,
			onRender,
			view: 'document-flow-item'
		};
	},

	getErrorMessage: function() {
		return _.gettext('Document flow item temporarily unavailable');
	}
});
