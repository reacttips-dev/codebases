const FieldFactory = require('components/fieldset/views/field-factory');
const _ = require('lodash');

module.exports = FieldFactory.extend({
	fields: _.assignIn({}, FieldFactory.prototype.fields, {
		'enum-mandatory': require('components/fieldset/views/field/enum-mandatory'),
		'composite-date-time': require('components/fieldset/views/field/composite-date-time'),
		'composite-type-subject': require('components/fieldset/views/field/composite-type-subject'),
		'boolean': require('components/fieldset/views/field/boolean')
	}),

	createClass: function(options) {
		const type = this.getFieldCustomType(options);

		const ExtendedField = this.fields.hasOwnProperty(type)
			? this.fields[type]
			: this.baseFieldClass;

		return new ExtendedField(options);
	},

	/**
	 *	Decides the field type based on options and custom definition.
	 *	Returns custom field type if defined, else returns default.
	 *
	 * @param {Object} options Options of the field
	 * @return {String}
	 */
	getFieldCustomType: function(options) {
		const productFieldType = this.getFieldType(options, 'product');
		const activityFieldType = this.getFieldType(options, 'activity');

		if (productFieldType === 'selectable') {
			return 'boolean';
		}

		switch (activityFieldType) {
			case 'type':
				return 'enum-mandatory';
			case 'due_date':
				return 'composite-date-time';
			case 'subject':
				return 'composite-type-subject';
			case 'done':
				return 'boolean';
			case 'duration':
				return 'duration';
			case 'busy_flag':
				return 'boolean';
			default:
				return options.model.get('field_type');
		}
	},

	/**
	 *	Decides whether the field is modelType of field.
	 *	If true, returns field key, otherwise null.
	 *
	 * @param {Object} options	Options of the field
	 * @param {String} modelType Type of the model e.g. activity, product, deal
	 * @return {String}
	 */
	getFieldType: function(options, modelType) {
		return options.contentModel && options.contentModel.type === modelType ? options.key : null;
	}
});
