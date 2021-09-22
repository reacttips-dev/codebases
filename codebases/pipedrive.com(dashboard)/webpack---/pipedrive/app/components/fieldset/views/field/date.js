const Field = require('../field');
const _ = require('lodash');
const Template = require('../../templates/field.html');
const moment = require('moment');

module.exports = Field.extend({
	type: 'date',

	template: _.template(Template),

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		return {
			label: this.formatDateDBToVisual(this.value)
		};
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		return {
			value: this.formatDateDBtoEditor(this.value)
		};
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};

		value[this.key] = this.formatDateEditorToDB($el.find('input').val());

		return value;
	},

	/**
	 * Format date from database format to display format
	 * @param  {String} value date
	 * @return {String}       formatted date
	 */
	formatDateDBToVisual: function(value) {
		let date;

		if (this.model.isDatetime()) {
			date = moment.utc(value, 'YYYY-MM-DD HH:mm:ss').local();
		} else {
			date = moment(value, 'YYYY-MM-DD');
		}

		return date.isValid() ? date.format('ll') : '';
	},

	/**
	 * Format date from database format to edit mode format
	 * @param  {String} value date
	 * @return {String}       formatted date
	 */
	formatDateDBtoEditor: function(value) {
		let date;

		if (this.model.isDatetime()) {
			date = moment.utc(value, 'YYYY-MM-DD HH:mm:ss').local();
		} else {
			date = moment(value, 'YYYY-MM-DD');
		}

		return date.isValid() ? date.format('L') : '';
	},

	/**
	 * Format date from editor format to database format
	 * @param  {String} value date
	 * @return {String}       formatted date
	 */
	formatDateEditorToDB: function(value) {
		const date = moment(value, 'L');

		if (!date.isValid()) {
			return '';
		} else if (this.model.isDatetime()) {
			return date
				.locale('en')
				.utc()
				.format('YYYY-MM-DD HH:mm:ss');
		} else {
			return date.locale('en').format('YYYY-MM-DD');
		}
	}
});
