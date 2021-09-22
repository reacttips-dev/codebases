const FieldModel = require('models/field');
const _ = require('lodash');
const TimeField = require('./time');
const Template = require('../../templates/field.html');

module.exports = TimeField.extend({
	type: 'timerange',

	template: _.template(Template),

	initialize: function() {
		const subfields = this.model.get('subfields');

		if (subfields) {
			this.submodel = new FieldModel(subfields[0]);
			this.subvalue = this.contentModel.get(this.submodel.get('key'));
		}
	},

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		const value = this.formatTime(this.value) || '…';
		const subvalue = this.formatTime(this.subvalue) || '…';

		return {
			label: `${value} - ${subvalue}`
		};
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		return {
			value: this.formatTime(this.value, true),
			subfields: [
				{
					value: this.formatTime(this.subvalue, true),
					key: this.submodel.get('key')
				}
			]
		};
	},

	/**
	 * Checks if field has been filled with value
	 * @return {Boolean} Boolean if field value is filled or not
	 */
	hasValue: function() {
		return !this.isEqual(this.value, null) || !this.isEqual(this.subvalue, null);
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};

		let start = $el.find('input').val();
		let until = $el
			.find('input')
			.eq(1)
			.val();

		start = start ? this.formatTimeEditorToDB(start) : null;
		until = until ? this.formatTimeEditorToDB(until) : null;

		value[this.key] = start;
		value[this.submodel.get('key')] = until;

		return value;
	}
});
