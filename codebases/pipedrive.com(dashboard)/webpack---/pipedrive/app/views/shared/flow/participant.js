const Backbone = require('backbone');
const Pipedrive = require('pipedrive');
const _ = require('lodash');
const Template = require('templates/shared/flow/participant.html');

/**
 * @classdesc
 * Participants flow item view
 *
 * @class views/shared/flow/Participant
 * @augments module:Pipedrive.View
 */
module.exports = Pipedrive.View.extend({
	template: _.template(Template),

	collection: null,

	initialize: function() {
		this.collection = this.model;
		this.collection.on('sort add remove', this.render, this);
		this.render();
	},

	render: function() {
		this.$el.html(this.template(this));
	},

	getPersonName: function(personModel) {
		if (personModel instanceof Backbone.Model) {
			const additionalData = personModel.get('additional_data') || {};

			return additionalData.person_name || '';
		}

		return '';
	}
});
