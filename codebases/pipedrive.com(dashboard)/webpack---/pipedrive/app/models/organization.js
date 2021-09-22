const _ = require('lodash');
const SyncEventModel = require('models/sync-event');
const CustomFieldHelper = require('models/customfieldhelper');
const fieldModelMapUtils = require('utils/field-model-map');

module.exports = SyncEventModel.extend(CustomFieldHelper).extend({
	readonly: ['cc_email', 'won_deals_count', 'lost_deals_count'],
	getMatchingFilters: true,

	url: function() {
		if (this.get('id')) {
			return `${app.config.api}/organizations/${this.get('id')}`;
		} else {
			return `${app.config.api}/organizations`;
		}
	},

	type: 'organization',

	allowDirectSync: true,

	relationKey: 'org_id',
	/**
	 * Map specific fields to models
	 * @type {Object}
	 * @enum {Object}
	 */
	fieldModelMap: fieldModelMapUtils.buildFieldModelMapFn(['person', 'organization']),

	initialize: function() {
		this.selfUpdateFromSocket();
	},

	getLink: function() {
		return !this.isNew() && `/organization/${this.get('id')}`;
	},

	/**
	 * merge another organization into this organization. On properties conflict, the current organization wins
	 * @param  {dealModel} anotherDeal will be deleted
	 * @void
	 */
	merge: function(another, options) {
		const data = {
			merge_with_id: this.id
		};

		this.save(
			data,
			_.assignIn(options, {
				url: `${app.config.api}/organizations/${another.get('id')}/merge`
			})
		);
	},

	getRelatedBy: function() {
		return { org_id: this.get('id') };
	}
});
