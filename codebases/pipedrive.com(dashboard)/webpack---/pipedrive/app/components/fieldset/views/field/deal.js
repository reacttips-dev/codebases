const RelatedModelField = require('./related-model');
const _ = require('lodash');
const Template = require('../../templates/field.html');

module.exports = RelatedModelField.extend({
	type: 'deal',
	displayAttr: 'title',
	template: _.template(Template),

	initialize: function() {
		this.matchRequired = true;
	},

	/**
	 * Get formatted field value
	 * @return {String} Formatted field value for current state
	 * @default Read state formatted value
	 */
	getReadValue: function() {
		const dealModel = this.contentModel.getRelatedModel(this.type, Number(this.value));

		if (dealModel) {
			return {
				label: dealModel.get('title'),
				link: dealModel.get('id') ? `/${this.type}/${this.value}` : false
			};
		}

		return {
			label: _.gettext('(hidden)'),
			hiddenField: true
		};
	}
});
