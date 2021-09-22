const Field = require('../field');
const _ = require('lodash');
const Template = require('../../templates/field/text.html');

module.exports = Field.extend({
	type: 'text',
	template: _.template(Template),

	// Needed to find value from dom from correct element
	tagName: 'textarea',

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		let val = _.trim($el.find(this.tagName).val());

		const value = {};

		// Decreasing multiple line-breaks and removing tabs
		val = val.replace(/\n\s*\n/g, '\n\n');
		val = val.replace(/\n\s/g, '\n');
		val = val.replace(/\t/g, '');

		value[this.key] = val;

		return value;
	}
});
