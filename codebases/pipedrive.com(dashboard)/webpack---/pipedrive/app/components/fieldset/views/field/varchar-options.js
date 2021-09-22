const Field = require('../field');
const _ = require('lodash');
const User = require('models/user');
const Template = require('../../templates/field/varchar-options.html');

module.exports = Field.extend({
	template: _.template(Template),
	type: 'varchar_options',

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		return {
			label: this.hasValue() ? this.value : ''
		};
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};
		const key = this.model.get('key');
		const $select = $el.find(`select[name=${key}]`);
		const $input = $el.find(`input[name=${key}-other]`);
		const options = User.fields.getByKey(this.model.fieldType, key).options;
		const selectValue = Number($select.val());

		let finalValue = $input.val();

		if (selectValue !== 0) {
			finalValue = _.find(options, { id: selectValue }).label;
		}

		value[this.key] = finalValue;

		return value;
	}
});
