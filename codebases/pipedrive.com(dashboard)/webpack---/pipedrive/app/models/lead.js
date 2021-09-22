const Pipedrive = require('pipedrive');
const CustomFieldHelper = require('models/customfieldhelper');
const fieldModelMapUtils = require('utils/field-model-map');

module.exports = Pipedrive.Model.extend(CustomFieldHelper).extend({
	type: 'lead',
	relationKey: 'lead_id',

	/**
	 * Map specific fields to models
	 * @type {Object}
	 * @enum {Object}
	 */
	fieldModelMap: fieldModelMapUtils.buildFieldModelMapFn(['person', 'organization']),

	getLink: function() {
		return `/leads/inbox/${this.get('id')}`;
	},

	getRelatedBy: function() {
		return { lead_id: this.get('id') };
	}
});
