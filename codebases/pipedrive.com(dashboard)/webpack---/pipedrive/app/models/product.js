const SyncEventModel = require('models/sync-event');
const CustomFieldHelper = require('models/customfieldhelper');
const User = require('models/user');
const _ = require('lodash');
const fieldModelMapUtils = require('utils/field-model-map');

module.exports = SyncEventModel.extend(CustomFieldHelper).extend(
	/** @lends models/Product.prototype */ {
		getMatchingFilters: true,

		url: function() {
			if (this.get('id')) {
				return `${app.config.api}/products/${this.get('id')}`;
			} else {
				return `${app.config.api}/products`;
			}
		},

		/**
		 * Type of the model
		 * @type {String}
		 * @default
		 */
		type: 'product',

		allowDirectSync: true,

		relationKey: 'product_id',

		/**
		 * Map specific fields to models
		 * @type {Object}
		 * @enum {Object}
		 */
		fieldModelMap: fieldModelMapUtils.buildFieldModelMapFn(['person', 'organization']),

		/**
		 * Product model that also updates itself automatically from web socket.
		 *
		 * @classdesc Product model
		 * @constructs
		 * @augments {module:Pipedrive.Model}
		 * @void
		 */
		initialize: function() {
			this.selfUpdateFromSocket();
		},

		getLink: function() {
			return !this.isNew() && `${app.config.baseurl}/product/${this.get('id')}`;
		},

		/**
		 * get attribute used by other models to relate to this
		 * for deal it is {deal_id: 123}
		 *
		 * @return {Object}
		 */
		getRelatedBy: function() {
			return { product_id: this.get('id') };
		},

		setCalculatedDefaultPrice: function(opts) {
			const prices = this.get('prices');
			const defaultPrice = _.find(prices, { currency: User.get('default_currency') });

			if (defaultPrice) {
				this.set({ price: defaultPrice.price }, opts || {});
			}
		}
	}
);
