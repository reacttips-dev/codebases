const _ = require('lodash');
const $ = require('jquery');
const FieldVarchar = require('./varchar');
const Template = require('../../templates/field/phone.html');
const fieldUsageTracking = require('utils/analytics/field-component-usage-tracking');
const { getDisplayLabel } = require('../../../../views/ui/typeLabels');

module.exports = FieldVarchar.extend({
	type: 'phone',
	template: _.template(Template),

	/**
	 * Get formatted field value
	 * @return {String} Formatted field value for current state
	 * @default Read state formatted value
	 */
	getReadValue: function() {
		return _.map(
			this.value,
			_.bind(function(item) {
				const data = this.getRelatedIds(this.contentModel, this.contentRelatedModel);
				const value = _.isObject(item) ? item.value : item;
				const displayLabel = getDisplayLabel('phone', item.label);

				return {
					link: this.createLink(value, data),
					label: item.label,
					displayLabel,
					value: this.formatValue(value)
				};
			}, this)
		);
	},

	/**
	 * Overrides default checks if field has been filled with value
	 * @return {Boolean} Boolean if field value is filled or not
	 */
	hasValue: function() {
		return this.value && this.value[0] && this.value[0].value;
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};
		const inputValues = [];

		$el.find('.inputContactRow').each(function(i) {
			const inputValue = $.trim(
				$(this)
					.find('input')
					.val()
			);

			if (inputValue) {
				inputValues.push({
					label: $(this)
						.find('select')
						.val(),
					value: inputValue,
					primary: i === 0
				});
			}
		});

		// API hack - as it returns empty email every time
		if (!inputValues.length) {
			inputValues.push({ value: '', primary: true });
		}

		value[this.key] = inputValues;

		return value;
	},

	createLink: function(value, data) {
		return _.createPhoneLink(value, data);
	},

	formatValue: function(value) {
		if (!value) {
			return '';
		}

		return _.formatPhoneNumber(value);
	},

	trackValueClick: function(data) {
		data = _.assignIn(data, {
			field_subtype: 'phone',
			field_name: this.model.get('name')
		});

		fieldUsageTracking.phone.valueClicked(data);
	}
});
