const _ = require('lodash');
const Pipedrive = require('pipedrive');
const DealModel = require('models/deal');
const sortUtils = require('utils/sort-utils');
const $ = require('jquery');

/**
 * Deals collection
 *
 * @param  {Object}
 * @class collections/Deals
 * @augments module:Pipedrive.Pipedrive.Collection
 */
module.exports = Pipedrive.Collection.extend(
	/** @lends collections/Deals.prototype */ {
		model: DealModel,

		relatedModel: null,

		type: 'deal',

		requiredFields: ['id', 'active', 'status', 'title', 'person_id', 'org_id'],

		url: function() {
			let url = `${app.config.api}/deals`;

			if (this.options.relatedModel) {
				url = `${app.config.api}/${this.options.relatedModel.type}s/${this.options.relatedModel.id}/deals`;
			}

			if (_.isObject(this.options.parameters)) {
				url += `?${$.param(this.options.parameters)}`;
			}

			return url;
		},

		initialize: function(data, options) {
			this.options = options || {};

			if (this.options.relatedModel) {
				app.global.bind('deal.model.*.add', this.onDealUpdate, this);
				app.global.bind('deal.model.*.update', this.onDealUpdate, this);
				app.global.bind('deal.model.*.delete', this.onDealDelete, this);
			}
		},

		isRelated: function(deal) {
			const relatedModelId = this.options.relatedModel.id;

			return (
				!relatedModelId ||
				relatedModelId === deal.get(this.options.relatedModel.relationKey)
			);
		},

		isCollectionLimitExceeded: function() {
			return (
				this.options.parameters &&
				this.options.parameters.limit &&
				this.options.parameters.limit <= this.length
			);
		},

		onDealUpdate: function(deal) {
			const dealInCollection = this.find({ id: deal.id });
			const isDealDeleted = deal.get('deleted');
			const isLimitExceeded = this.isCollectionLimitExceeded();
			const isRelated = this.isRelated(deal);

			if (!isDealDeleted && !dealInCollection && !isLimitExceeded && isRelated) {
				this.add(deal);
			} else if (dealInCollection && isDealDeleted) {
				this.remove(dealInCollection);
			}

			if (isLimitExceeded && isRelated) {
				this.pull();
			}
		},

		onDealDelete: function(deal) {
			const dealInCollection = this.find({ id: deal });

			if (dealInCollection) {
				this.remove(dealInCollection);
			}
		},

		onUnload: function() {
			app.global.unbind('deal.model.*.add', this.onDealUpdate, this);
			app.global.unbind('deal.model.*.update', this.onDealUpdate, this);
			app.global.unbind('deal.model.*.delete', this.onDealDelete, this);
		},

		pull: function(options) {
			if (options && options.data && options.data.sort) {
				const removeNameFieldFromSortParameters = true;

				options.data.sort = sortUtils.applySortFieldsMapping(
					options.data.sort,
					removeNameFieldFromSortParameters
				);
			}

			return Pipedrive.Collection.prototype.pull.call(this, options);
		}
	},
	{
		getListApiEndpoint: function() {
			return '/deals/list';
		},

		includeFields: function(fields) {
			const result = ['products_count'];

			if (fields.indexOf('next_activity_date') !== -1) {
				result.push('next_activity_time');
			}

			if (fields.indexOf('last_activity_date') !== -1) {
				result.push('last_activity_time');
			}

			return result;
		}
	}
);
