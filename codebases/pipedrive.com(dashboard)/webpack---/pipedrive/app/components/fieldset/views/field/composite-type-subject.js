const Field = require('components/fieldset/views/field');
const FieldModel = require('models/field');

module.exports = Field.extend({
	type: 'composite-type-subject',

	initialize: function() {
		const subfields = this.model.get('subfields');

		if (subfields) {
			this.submodel = new FieldModel(subfields[0]);
			this.subvalue = this.contentModel.get(this.submodel.get('key')) || '';
		}
	},

	hasValue: function() {
		return !!this.contentModel.get('id');
	},

	/**
	 * Get type-subject value to display in the table cell
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		return {
			link: this.contentModel.getLink(),
			label: this.value || '',
			icon_key: this.contentModel.getTypeIcon()
		};
	},

	/**
	 * Used to create the edit template
	 * @return {Object} Template data
	 */
	getEditValue: function() {
		return {
			field_type: 'composite-type-subject',
			value: this.value
		};
	}
});
