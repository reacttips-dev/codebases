const Field = require('../field');
const _ = require('lodash');

module.exports = Field.extend({
	type: 'visible_to',

	/**
	 * Get formatted field value
	 * @return {String} Formatted field value for current state
	 * @default Read state formatted value
	 */
	getReadValue: function() {
		const v = isNaN(this.value) ? this.value : Number(this.value);

		return {
			label: (_.find(this.model.get('options'), { id: v }) || {}).label || ''
		};
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		return {
			options: _.map(
				this.model.get('options'),
				_.bind(function(option) {
					const o = _.clone(option);

					o.checked = option.id === Number(this.value);

					return o;
				}, this)
			)
		};
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};
		const selectedValue = Number($el.find('select').val());

		value[this.key] = selectedValue > 0 ? selectedValue : null;

		return value;
	}
});
