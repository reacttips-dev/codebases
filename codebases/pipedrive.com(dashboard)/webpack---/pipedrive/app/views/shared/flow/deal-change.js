const _ = require('lodash');
const Pipedrive = require('pipedrive');
const DealTemplate = require('templates/shared/flow/deal-change.html');

module.exports = Pipedrive.View.extend({
	template: _.template(DealTemplate.replace(/>\s+</g, '><')),

	initialize: function(options) {
		this.options = options;
		this.render();
	},

	templateHelpers: function() {
		return {
			model: this.options.model
		};
	}
});
