const Field = require('../field');
const _ = require('lodash');
const Template = require('../../templates/field.html');
const labelsManagementUtils = require('components/labels-management/utils');

module.exports = Field.extend({
	type: 'enum',

	template: _.template(Template),

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		const id = isNaN(this.value) ? this.value : Number(this.value);

		return {
			label: (_.find(this.model.get('options'), { id }) || {}).label || ''
		};
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		const value = {};
		const hasValue = this.hasValue();

		value.style = 'switch-buttons deselectable';

		value.options = [
			{
				id: null,
				label: `(${_.gettext('none')})`,
				selected: !hasValue
			}
		].concat(
			_.map(
				this.model.get('options'),
				_.bind(function(option) {
					const o = _.clone(option);

					if (!o.data) {
						o.data = {};
					}

					if (o.color) {
						o.data.color = o.color;
					}

					o.selected = hasValue && option.id === Number(this.value);

					return o;
				}, this)
			)
		);

		if (this.model.get('key') === 'label') {
			value.field_type = 'select';

			value.select2 = {
				dropdownAutoWidth: false,
				formatResult: labelsManagementUtils.formatSelect2LabelOption,
				formatSelection: labelsManagementUtils.formatSelect2LabelOption
			};
		}

		return value;
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};

		// Enum can be radio buttons or select element

		let input = $el.find('.widget-radio.selected input');

		if (!input.length) {
			input = $el.find('select');
		}

		if (!input.length) {
			input = $el.find('input[type="radio"]:checked');
		}

		value[this.key] = input.length ? input.val() : '';

		return value;
	}
});
