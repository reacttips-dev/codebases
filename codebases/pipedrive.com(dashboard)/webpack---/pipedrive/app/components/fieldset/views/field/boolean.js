const EnumMandatoryField = require('./enum-mandatory');
const _ = require('lodash');

module.exports = EnumMandatoryField.extend({
	type: 'boolean',

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		const option = _.find(this.model.get('options'), { id: this.value }) || {};

		return {
			label: option.label || ''
		};
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor
	 */
	getValueFromEditor: function($el) {
		const value = {};

		let input = $el.find('.widget-radio.selected input');

		if (!input.length) {
			input = $el.find('input[type="radio"]:checked');
		}

		value[this.key] = input.val() === 'true';

		return value;
	},

	/**
	 * Checks if values are equal.
	 * Has strict check but empty values such as null, undefined and '' are considered the equal as well.
	 *
	 * @param  {*}  a      First value to compare
	 * @param  {*}  b      Second value to compare
	 * @return {Boolean}   Boolean to determine if the values are equal with the rules we have set.
	 */
	isEqual: function(a, b) {
		/* eslint-disable no-undefined */
		a = _.includes([undefined, ''], a) ? null : a;
		b = _.includes([undefined, ''], b) ? null : b;

		/* eslint-enable no-undefined */
		return (_.isNull(a) && _.isNull(b)) || a === b;
	}
});
