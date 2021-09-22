const Field = require('../field');
const _ = require('lodash');
const $ = require('jquery');

module.exports = Field.extend({
	displayAttr: null,

	/**
	 * Get formatted field value
	 * @return {String} Formatted field value for current state
	 * @default Read state formatted value
	 */
	getReadValue: function() {
		const relatedModel = this.contentModel.getRelatedModel(this.type, Number(this.value));

		if (relatedModel) {
			return {
				label: relatedModel.get(this.displayAttr),
				link: relatedModel.get('id') ? `/${this.type}/${this.value}` : false
			};
			// "value === 0" means that a new object is being created
		} else if (this.value === 0) {
			return {
				label: ''
			};
		}

		return {
			label: _.gettext('(hidden)'),
			hiddenField: true
		};
	},

	getValueEditorObj: function(value, key, relatedModel, displayFieldHelper, helperName) {
		this.value_id = Number(this.value);

		if (value && key === 'org_id' && helperName) {
			this.value = helperName;
		} else if (relatedModel) {
			this.value = relatedModel.get(this.displayAttr);
			this.prefillModel = relatedModel;
		} else if (displayFieldHelper) {
			this.value = displayFieldHelper;
		} else if (value) {
			this.value = _.gettext('(hidden)');
		}
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		let relatedModel, displayFieldHelper, helperName;

		if (this.contentModel) {
			relatedModel = this.contentModel.getRelatedModel(this.type, this.value);
			displayFieldHelper = this.contentModel.get(`${this.model.get('display_field')}_helper`);
			helperName = this.contentModel.get(`${this.key}_helper`);
		}

		return new this.getValueEditorObj(
			this.value,
			this.key,
			relatedModel,
			displayFieldHelper,
			helperName
		);
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};
		const data = {
			id: Number($el.find('input[type="hidden"]').val()),
			name: $.trim($el.find('input[type="text"]').val())
		};

		if (!data.id || this.contentModel.getRelatedData(this.type, data.id)) {
			this.contentModel.setRelatedData(this.type, data.id, data);
		}

		value[this.key] = _.isEmpty(data.name) ? null : data.id;
		value[`${this.key}_helper`] = data.name;

		return value;
	}
});
