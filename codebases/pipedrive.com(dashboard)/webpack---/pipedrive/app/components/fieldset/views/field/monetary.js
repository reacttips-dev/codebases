const FieldModel = require('models/field');
const { format, unformat } = require('utils/formatter');
const _ = require('lodash');
const Field = require('../field');
const Template = require('../../templates/field.html');

module.exports = Field.extend({
	type: 'monetary',

	template: _.template(Template),

	initialize: function() {
		const subfields = this.model.get('subfields');

		if (subfields) {
			this.submodel = new FieldModel(subfields[0]);
			this.subvalue =
				(this.contentModel && this.contentModel.get(this.submodel.get('key'))) || '';
		}
	},

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		return {
			label: this.canValueBeFormatted() ? format(this.value, this.subvalue) : ''
		};
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		return {
			value: this.canValueBeFormatted() ? format(this.value, this.subvalue, true) : '',
			currency: this.subvalue
		};
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};
		const monetaryValue = $el.find('input').val();

		value[this.key] = monetaryValue === '' ? null : unformat(monetaryValue);

		if (this.submodel) {
			value[this.submodel.get('key')] = $el.find('select').val();
		}

		return value;
	},

	canValueBeFormatted: function() {
		return format && this.subvalue;
	}
});
