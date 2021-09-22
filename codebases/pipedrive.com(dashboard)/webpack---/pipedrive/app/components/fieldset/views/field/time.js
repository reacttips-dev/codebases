const Field = require('../field');
const _ = require('lodash');
const Template = require('../../templates/field.html');
const moment = require('moment');
const momentHelpers = require('utils/helpers-moment');

module.exports = Field.extend({
	type: 'time',

	template: _.template(Template),

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		return {
			label: this.formatTime(this.value)
		};
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		return {
			value: this.formatTime(this.value, true),
			subfields: null
		};
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};

		value[this.key] = this.formatTimeEditorToDB($el.find('input').val());

		return value;
	},

	/**
	 * Format time
	 * @param  {String} value time
	 * @param {Boolean} isEditMode defines whether its field edit mode
	 * @return {String}       formatted time
	 */
	formatTime: function(value, isEditMode) {
		const time = moment(value, 'HH:mm:ss');

		let formattedTime;

		if (!time.isValid()) {
			return '';
		}

		if (this.key === 'duration') {
			formattedTime = time.format('H:mm');
		} else if (isEditMode) {
			formattedTime = time.getEditorTime();
		} else {
			formattedTime = time.format('LT');
		}

		return formattedTime;
	},

	/**
	 * Format time from editor format to database format
	 * @param  {String} value time
	 * @return {String}       formatted time
	 */
	formatTimeEditorToDB: function(value) {
		const time = moment(value, momentHelpers.getEditorTimeFormat(), 'en');

		return time.isValid() ? time.format('HH:mm:ss') : '';
	}
});
