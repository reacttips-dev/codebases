const Field = require('../field');
const _ = require('lodash');
const FieldModel = require('models/field');
const moment = require('moment');
const momentHelpers = require('utils/helpers-moment');
const $ = require('jquery');
const EDIT_TIME = 'EDIT_TIME';
const DateTimeFormatHelper = require('utils/datetime-format-helpers');

module.exports = Field.extend({
	type: 'composite-date-time',

	initialize: function(options) {
		const subfields = this.model.get('subfields');
		const fieldOptions = options.fieldOptions || {};

		if (subfields) {
			this.submodel = new FieldModel(subfields[0]);
			this.subvalue = this.contentModel.get(this.submodel.get('key')) || '';
		}

		this.unsetEmptyValues = _.isBoolean(fieldOptions.unsetEmptyValues)
			? fieldOptions.unsetEmptyValues
			: false;
	},

	/**
	 * Get datetime value to display in the table cell
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		// Refreshes localDueDate
		this.contentModel.cacheCalculatedValues();

		return {
			label: _.timestamp(this.contentModel.localDueDate, 'compositeDateTime', false)
		};
	},

	/**
	 * Used to create the edit template
	 * @return {Object} Template data
	 */
	getEditValue: function() {
		const dateValue = this.contentModel.get('due_date') ? this.getFormattedEditValue('L') : '';
		const timeValue = this.contentModel.get('due_time')
			? this.getFormattedEditValue(EDIT_TIME)
			: '';

		return {
			field_type: 'composite-date-time',
			value: dateValue,
			sub: {
				key: 'due_time',
				value: timeValue
			}
		};
	},

	/**
	 * Either returns the date in an appropriate format if
	 * set or just an empty string if not set or invalid.
	 *
	 * @param  {String} format Date format
	 * @return {String}        Formatted local date
	 */
	getFormattedEditValue: function(format) {
		const date = this.contentModel.localDueDate;

		if (date.isValid()) {
			if (format === 'EDIT_TIME') {
				return date.getEditorTime();
			}

			return date.format(format);
		}

		return '';
	},

	/**
	 * Triggered when the editor saves.
	 * Dates are converted back to UTC and sent to the API call.
	 *
	 * @param  {jQuery} $el Edit field jQuery object
	 * @return {Object}		API PUT contents
	 */
	getValueFromEditor: function($el) {
		const dateInput = $el.find('input[name=due_date]').val();
		const timeInput = $el.find('input[name=due_time]').val();
		const date = moment(dateInput, 'L').isValid() ? dateInput : '';

		let time;

		if (
			moment(timeInput, momentHelpers.getEditorTimeFormat()).isValid() &&
			this.inputContainsNumbers(timeInput)
		) {
			time = timeInput;
		} else {
			time = '';
		}

		return this.convertToSaveObject(date, time);
	},

	// Converts date and time to and object that can be sent to the API
	convertToSaveObject: function(date, time) {
		const utcDateTime = this.getUTCDateTime(date, time);
		const values = {
			due_time: time ? utcDateTime.format('HH:mm') : '',
			due_date: date ? utcDateTime.format('YYYY-MM-DD') : ''
		};

		if (!date) {
			delete values.due_date;
		}

		if (!time && this.unsetEmptyValues) {
			delete values.due_time;
		}

		return values;
	},

	getUTCDateTime: function(date, time) {
		const timeFormat = momentHelpers.getEditorTimeFormat();

		if (date && time) {
			const newDate = moment(date, 'L')
				.locale('en')
				.format(DateTimeFormatHelper.UTC_DATE_FORMAT);

			return moment(
				`${newDate} ${time}`,
				`${DateTimeFormatHelper.UTC_DATE_FORMAT} ${timeFormat}`,
				'en'
			).utc();
		}

		if (date && !time) {
			// Whenever only date is provided, handle it as UTC converted value,
			// additional UTC conversions are not needed
			return moment.utc(date, 'L');
		}

		return moment(time, timeFormat, 'en').utc();
	},

	bindSanitizing: function($el) {
		$el.find('input').on(
			'blur',
			_.bind(function(ev) {
				const fieldType = ev.target.name;

				if (!_.includes(['due_date', 'due_time'], fieldType)) {
					return;
				}

				if (this.getValueFromEditor($el)[fieldType] === '') {
					$(ev.target).val('');
				}
			}, this)
		);
	},

	inputContainsNumbers: function(input) {
		return /\d/.test(input);
	}
});
