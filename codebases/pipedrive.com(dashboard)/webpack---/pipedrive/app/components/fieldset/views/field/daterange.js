const FieldModel = require('models/field');
const _ = require('lodash');
const DateField = require('./date');
const Template = require('../../templates/field.html');
const moment = require('moment');

module.exports = DateField.extend({
	type: 'daterange',

	submodel: null,
	subvalue: null,

	template: _.template(Template),

	initialize: function() {
		const subfields = this.model.get('subfields');

		if (subfields) {
			this.submodel = new FieldModel(subfields[0]);
			this.subvalue = this.contentModel && this.contentModel.get(this.submodel.get('key'));
		}
	},

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		const value = this.formatDateDBToVisual(this.value) || '…';
		const subvalue = this.formatDateDBToVisual(this.subvalue) || '…';

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
			value: this.formatDateDBtoEditor(this.value),
			subfields: [
				{
					value: this.formatDateDBtoEditor(this.subvalue),
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
		const dateA = moment($el.find('input').val(), 'L');
		const dateB = moment(
			$el
				.find('input')
				.eq(1)
				.val(),
			'L'
		);

		value[this.key] = this.formatDateEditorToDB(dateA);
		value[this.submodel.get('key')] = this.formatDateEditorToDB(dateB);

		return value;
	}
});
