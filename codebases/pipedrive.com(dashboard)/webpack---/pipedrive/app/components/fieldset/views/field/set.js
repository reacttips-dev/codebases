const _ = require('lodash');
const Field = require('../field');
const Template = require('../../templates/field/set.html');

module.exports = Field.extend({
	type: 'set',

	template: _.template(Template),

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		const labels = [];

		if (this.value) {
			_.forEach(
				this.value.split(','),
				_.bind(function(id) {
					const label = (_.find(this.model.get('options'), { id: Number(id) }) || {})
						.label;

					if (label) {
						labels.push(label);
					}
				}, this)
			);
		}

		return {
			labels
		};
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		const value = _.isString(this.value) ? this.value.split(',') : [];

		return {
			options: _.map(
				this.model.get('options'),
				_.bind(function(option) {
					option.selected = value.indexOf(String(option.id)) > -1;

					return option;
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

		value[this.key] = ($el.find('select').val() || []).join(',');

		return value;
	}
});
