const Field = require('../field');
const _ = require('lodash');
const Template = require('../../templates/field/text.html');
const fieldUsageTracking = require('utils/analytics/field-component-usage-tracking');

module.exports = Field.extend({
	type: 'varchar',

	template: _.template(Template),

	// Needed to find value from dom from correct element
	tagName: 'input',

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		// This is another our field hack - custom field phone behaves as varchar, except its actually phone link.
		if (this.isCustomPhoneField()) {
			const data = this.getRelatedIds(this.contentModel, this.contentRelatedModel);

			return {
				link: _.createPhoneLink(this.value, data),
				label: this.value ? _.formatPhoneNumber(this.value) : ''
			};
		}

		// Make person|organization names, deal titles & activity subjects link to correct object
		if (
			_.includes(['name', 'title', 'subject'], this.key) &&
			this.contentModel &&
			_.isFunction(this.contentModel.getLink)
		) {
			return {
				link: this.contentModel.getLink(),
				label: this.value
			};
		}

		return {
			label: this.value
		};
	},

	getRelatedIds: function(model, relatedModel) {
		// get object primary id attributes from both current model and model of the context that contains it
		const relatedIds = _.assignIn({}, model.getRelatedBy());

		if (relatedModel && _.isFunction(relatedModel.getRelatedBy)) {
			_.assignIn(relatedIds, relatedModel.getRelatedBy());
		}

		// Priority: current model primary attribute, if null then context model attribute, if null
		// then current model non-primary attribute
		_.forEach(['deal_id', 'person_id', 'org_id'], function(attribute) {
			if (!_.has(relatedIds, attribute)) {
				const valueInContextModel = relatedModel && relatedModel.get(attribute);
				const valueInModel = model.get(attribute);

				relatedIds[attribute] = valueInContextModel || valueInModel;
			}
		});

		return relatedIds;
	},

	trackValueClick: function(data) {
		if (this.isCustomPhoneField()) {
			data = _.assignIn(data, {
				field_subtype: 'custom',
				field_name: this.model.get('name')
			});

			fieldUsageTracking.phone.valueClicked(data);
		}
	},

	isCustomPhoneField: function() {
		return this.model.get('phoneCustomField');
	}
});
