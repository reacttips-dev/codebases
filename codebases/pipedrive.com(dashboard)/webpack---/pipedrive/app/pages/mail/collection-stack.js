'use strict';

const _ = require('lodash');

/**
 * A class that helps to remember Collections and share them
 *
 * @class pages/mail/ViewStack
 */

const CollectionStack = function() {
	this.stack = [];
};

_.assignIn(
	CollectionStack.prototype,
	/** @lends pages/mail/CollectionStack.prototype */ {
		/**
		 * Creates a collection and pushes it to the stack. If collection with the same key already exists,
		 * it will overwrite the existing collection.
		 *
		 * @param  {Object} options
		 *     Optional and required options:
		 *         {
		 *         		@param  {String} key 				key of the collection to determine uniqueness
		 *         		@param  {Object} Collection 		Collection class that is used for making new collection instance
		 *         		@param  {Object} models				(optional) models that will be passed to the collection instance
		 *         		@param  {Object} collectionOptions	(optional) options that will be passed to the collection instance
		 *         }
		 *
		 * @return {Object}            collection instance
		 */
		createCollection: function(options) {
			const stackedItem = _.find(this.stack, { key: options.key });
			const collectionInstance = new options.Collection(
				options.models,
				options.collectionOptions
			);

			if (stackedItem) {
				stackedItem.collection = collectionInstance;
			} else {
				this.stack.push({
					key: options.key,
					collection: collectionInstance
				});
			}

			return collectionInstance;
		},

		/**
		 * Gets a cached collection based with a key string. If collection doesn't exist, returns 'null'
		 * @param  {String} key key of the collection
		 * @return {Object}     stacked collection or 'null' if couldn't find any with specified key
		 */
		getStackedCollection: function(key) {
			const stackedItem = _.find(this.stack, { key });

			return stackedItem ? stackedItem.collection : null;
		}
	}
);

module.exports = CollectionStack;
