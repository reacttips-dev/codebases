const Backbone = require('backbone');
const Pipedrive = require('pipedrive');
const _ = require('lodash');
const Company = require('collections/company');
const Template = require('templates/shared/flow/follower.html');

/**
 * @classdesc
 * Followers flow item view
 *
 * @class views/shared/flow/Follower
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

	getUserName: function(id) {
		const userModel = Company.getUserById(id);

		if (userModel instanceof Backbone.Model) {
			return userModel.get('name');
		}

		return '';
	}
});
