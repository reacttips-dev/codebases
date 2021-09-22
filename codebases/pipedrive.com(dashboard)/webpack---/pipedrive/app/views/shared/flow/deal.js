const Pipedrive = require('pipedrive');
const _ = require('lodash');
const DealTemplate = require('templates/shared/flow/deal.html');

module.exports = Pipedrive.View.extend({
	template: _.template(DealTemplate.replace(/>\s+</g, '><')),

	initialize: function(options) {
		this.options = options;

		this.render();
		this.model.onChange(
			'title value currency status owner next_activity_date next_activity_time',
			_.bind(this.render, this)
		);
	},

	selfRender: function() {
		this.$el.html(this.template(this));
	}
});
