const Pipedrive = require('pipedrive');
const _ = require('lodash');
const DealModel = require('models/deal');

/**
 * Collection of deals linked to the threads
 *
 * @param  {Object}
 * @class collections/LinkedDealsCollection
 * @augments module:Pipedrive.Pipedrive.Collection
 */

const LinkedDealsCollection = Pipedrive.Collection.extend(
	/** @lends collections/LinkedDealsCollection.prototype */ {
		model: DealModel,

		url: null,

		dealsQueue: null,

		initialize: function() {
			this.dealsQueue = {};
		},

		/**
		 * Gets the deal from the collection (itself) and passes it to the given callback.
		 * If the deal is not in the collection yet, creates it,
		 * adds it into itself, pulls it and passes it to the given callback.
		 *
		 * @param  {Object}	data 	Expected attributes in the "data" parameter:
		 *                        		"dealId"
		 *                        		"success"	- The success callback to pass the acquired dealModel to.
		 *                        		"error"		- (optional) Error callback
		 * @void
		 */
		getDeal: function(data) {
			let dealModel = this.get(data.dealId);

			if (dealModel) {
				data.success(dealModel);
			} else {
				dealModel = new DealModel({
					id: data.dealId,
					title: ''
				});

				this.add(dealModel);
				this.throttledPull(dealModel, data);
			}
		},

		/**
		 * Adds deal models and callbacks to the queue to pull later. Prevents pulling the same deals multiple times.
		 * @param  {Object} dealModel
		 * @void
		 */
		throttledPull: function(dealModel, data) {
			const dealId = data.dealId;
			const callbacks = {
				success: data.success,
				error: data.error
			};

			if (_.has(this.dealsQueue, dealId)) {
				this.dealsQueue[dealId].callbacksList.push(callbacks);
			} else {
				this.dealsQueue[dealId] = {
					model: dealModel,
					callbacksList: [callbacks]
				};
			}

			if (this.pullTimeout) {
				clearTimeout(this.pullTimeout);
			}

			this.pullTimeout = setTimeout(_.bind(this.pullDeals, this), 300);
		},

		/**
		 * Pull each deal separately in pull queue, because we don't have corresponding API endpoint jet
		 * @void
		 */
		pullDeals: function() {
			_.each(
				this.dealsQueue,
				function(data) {
					data.model.pull({
						success: function(dealModel) {
							_.each(
								data.callbacksList,
								function(callbacks) {
									callbacks.success(dealModel);
								}.bind(this)
							);
						}.bind(this),
						error: function(dealModel) {
							_.each(
								data.callbacksList,
								function(callbacks) {
									if (_.isFunction(callbacks.error)) {
										callbacks.error(dealModel);
									}
								}.bind(this)
							);
						}.bind(this)
					});
				}.bind(this)
			);

			this.dealsQueue = {};
		}
	}
);

module.exports = new LinkedDealsCollection();
