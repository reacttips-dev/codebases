const Field = require('../field');
const _ = require('lodash');
const Template = require('../../templates/field.html');
const { formatNumber, unformat } = require('utils/formatter');

module.exports = Field.extend({
	type: 'double',

	template: _.template(Template),

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		return {
			label: _.isNumber(this.value) ? formatNumber(this.value) : ''
		};
	},

	validateProbabilityField: function(value) {
		if (this.key === 'probability') {
			if (value > 100) {
				value = 100;
			} else if (value < 0) {
				value = 0;
			}
		}

		return value;
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		return {
			value: this.getReadValue().label
		};
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};

		let number = $el.find('input[type="text"]').val();

		number = this.validateProbabilityField(number);

		value[this.key] = number === '' ? null : unformat(number);

		return value;
	}
});
