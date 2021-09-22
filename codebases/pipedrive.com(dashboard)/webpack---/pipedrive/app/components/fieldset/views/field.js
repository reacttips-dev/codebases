const Pipedrive = require('pipedrive');
const _ = require('lodash');
const { createLinks } = require('@pipedrive/sanitize-html');
const $ = require('jquery');

let local;

// prettier-ignore
const Field = function(options) { // NOSONAR
	this.options = options || {};

	// Custom on save callback
	this.onSave = this.options.onSave;

	// Custom on cancel callback
	this.onCancel = this.options.onCancel;

	// Field model
	this.model = this.options.model;

	// Field key in content model (deal, organization, etc.)
	this.key = this.options.key;

	// Field value in content model (deal, organization, etc.)
	this.value = this.options.value;

	// Possible field states
	this.states = this.options.states;

	// Field state for rendering in content model (deal, organization, etc.)
	this.state = this.options.state;

	// Content model (deal, organization, etc.) where field is taken
	this.contentModel = this.options.contentModel;
	// Related model of content model (deal, organization, etc.) where field is taken
	this.contentRelatedModel = this.options.contentRelatedModel;

	this.initialize(options);
};

_.assignIn(Field.prototype, Pipedrive.Events, {
	/**
	 * Template of field view
	 */
	template: _.template('Empty template'),

	initialize: function() {
		this.createLinks = createLinks;
	},

	/**
	 * Get content of current class
	 * @return {String} html content of current class
	 */
	getTemplate: function() {
		let template = this.template;

		if (_.isFunction(this.options.customTemplate)) {
			template = this.options.customTemplate(this);
		}

		return template;
	},

	/**
	 * Determines if field is visible or not
	 * @return {Boolean} is visible or not
	 */
	isVisible: function() {
		return this.hasValue() || this.model.get('important_flag');
	},

	/**
	 * Checks if field has been filled with value
	 * @return {Boolean} Boolean if field value is filled or not
	 */
	hasValue: function() {
		return !this.isEqual(this.value, null);
	},

	/**
	 * Determines if this field is editable
	 * @return {Boolean} [description]
	 */
	isEditable: function() {
		return this.model.get('bulk_edit_allowed');
	},

	/**
	 * Get field value formatted as needed for this specific state
	 * @return {Object} Formatted field value for current state
	 * @default Read state formatted value
	 */
	getFormattedValue: function() {
		switch (this.state) {
			case this.states.EDIT:
			case this.states.SAVING:
			case this.states.EDIT_BULK:
				return this.getEditValue();

			default:
				if (this.hasValue()) {
					return this.getReadValue();
				}

				return this.getEmptyValue();
		}
	},

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		return {
			label: this.hasValue() ? this.value : ''
		};
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		return {
			value: this.hasValue() ? this.value : ''
		};
	},

	/**
	 * Get empty value of the field, returned when this.hasValue() returns false
	 * @return {Object} empty value of the field
	 */
	getEmptyValue: function() {
		return {
			label: '',
			value: null
		};
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtain
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};

		value[this.key] = $.trim($el.find('input').val());

		return value;
	},

	/**
	 * Update field state
	 * @param {String} toState state to which field should be changed to
	 */
	setState: function(toState) {
		// If not valid state or already in that state, do nothing
		if (!_.includes(this.states, toState) || this.state === toState) {
			return;
		}

		this.state = toState;
	},

	/**
	 * Set value of field
	 * @param {String|Object} value new value of current field
	 */
	setValue: function(value) {
		this.value = value;

		if (this.submodel) {
			this.subvalue = this.contentModel.get(this.submodel.get('key'));
		}
	},

	/**
	 * Get value of field
	 * @return {String|Number|Object} value set for this specific field
	 */
	getValue: function() {
		return this.value;
	},

	/**
	 * Checks if values are equal.
	 * Has strict check but empty values such as null, undefined and '' are considered the equal as well.
	 *
	 * @param  {*}  a      First value to compare
	 * @param  {*}  b      Second value to compare
	 * @return {Boolean}   Boolean to determine if the values are equal with the rules we have set.
	 */
	isEqual: function(a, b) {
		if (_.isObject(a)) {
			return _.isEqual(a, b);
		} else {
			a = local.resetEmptyValue.call(this, a);
			b = local.resetEmptyValue.call(this, b);

			return (_.isNull(a) && _.isNull(b)) || a === b;
		}
	}
});

Field.extend = Pipedrive.View.extend;

local = {
	/**
	 * Resets empty values to NULL if they are undefined false or an empty string ''.
	 * @param  {*}      value Value to reset
	 * @return {*}      Reseted value
	 */
	resetEmptyValue: function(value) {
		if (typeof value === 'undefined' || _.includes([false, ''], value)) {
			return null;
		}

		return value;
	}
};

module.exports = Field;
