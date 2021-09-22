const Field = require('../field');
const _ = require('lodash');

module.exports = Field.extend({
	type: 'status',

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		return {
			options: _.map(this.model.get('options'), function(option) {
				const selectOption = _.clone(option);

				selectOption.selected = this.value === option.id;

				return selectOption;
			})
		};
	},

	getReadValue: function() {
		const value = this.hasValue() ? this.value : '';
		const option = _.find(this.model.get('options'), { id: value });

		return (
			option || {
				label: ''
			}
		);
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};

		value[this.key] = $el.find('select').val();

		return value;
	}
});
