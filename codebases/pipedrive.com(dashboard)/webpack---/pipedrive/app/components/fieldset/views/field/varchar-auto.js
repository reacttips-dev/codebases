const TextField = require('./text');
const _ = require('lodash');
const Template = require('../../templates/field/text.html');

module.exports = TextField.extend({
	type: 'varchar_auto',
	template: _.template(Template),

	// Needed to find value from dom from correct element
	tagName: 'input',

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		return {
			value: this.value,
			autocomplete_field_type: `${this.contentModel.type}Field`
		};
	}
});
