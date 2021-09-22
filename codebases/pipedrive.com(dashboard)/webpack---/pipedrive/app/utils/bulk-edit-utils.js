'use strict';
const _ = require('lodash');
const Pipedrive = require('pipedrive');
const RELATED_OBJECTS_MODELS = {
	org_id: require('models/organization'),
	person_id: require('models/person'),
	deal_id: require('models/deal')
};
const BulkEditUtils = {
	getBulkEditByFilter: function(listSettings) {
		const customFilters = _.isFunction(listSettings.customFilterParams)
			? listSettings.customFilterParams()
			: null;
		const firstLetter = listSettings.getFirstLetter();
		const alphabetFilter = firstLetter ? { first_char: firstLetter } : null;
		const filter = listSettings.getFilter();
		const isEveryoneFilter = filter && filter.type === 'user' && filter.value === 'everyone';
		const quickFilters = _.omit(_.omitBy(customFilters, _.isNil), ['get_summary']);

		let mainFilter = {};

		if (isEveryoneFilter) {
			mainFilter = { everyone: 1 };
		} else if (filter) {
			mainFilter[`${filter.type}_id`] = filter.value;
		}

		const bulkEditFilter = _.assign(mainFilter, quickFilters, alphabetFilter);

		return bulkEditFilter;
	},

	hasSelectedItems: function(collection, totalCount) {
		const hasBulkEditFilter = !!collection.bulkEditFilter;
		const selectedIdsCount = collection.selectedIds.length;
		const excludedIdsCount = collection.excludedIds.length;

		return (hasBulkEditFilter && excludedIdsCount < totalCount) || !!selectedIdsCount;
	},

	allItemsSelected: function(collection, totalCount) {
		const hasBulkEditFilter = !!collection.bulkEditFilter;
		const selectedIdsCount = collection.selectedIds.length;
		const excludedIdsCount = collection.excludedIds.length;

		return (
			(hasBulkEditFilter && !excludedIdsCount) ||
			(totalCount > 0 && selectedIdsCount === totalCount)
		);
	},

	selectedItemsCount: function(collection, totalCount) {
		const hasBulkEditFilter = !!collection.bulkEditFilter;
		const selectedIdsCount = collection.selectedIds.length;
		const excludedIdsCount = collection.excludedIds.length;

		return hasBulkEditFilter ? totalCount - excludedIdsCount : selectedIdsCount;
	},

	isModelSelected: function(collection, modelId) {
		const bulkEditFilter =
			collection.bulkEditFilter && _.indexOf(collection.excludedIds, modelId) === -1;
		const isSelected = _.indexOf(collection.selectedIds, modelId) !== -1;

		return bulkEditFilter || isSelected;
	},

	getRequestParams: function(collection) {
		const filter = collection.bulkEditFilter || { ids: collection.selectedIds };
		const excludedIds = { exclude_ids: collection.excludedIds };

		return _.assign(filter, excludedIds);
	},

	fetchRelatedModels: function fetchRelatedModels(data, existingRelatedModels, callback) {
		const fieldsKeysToFetch = _.intersection(_.keys(data), _.keys(RELATED_OBJECTS_MODELS));
		const relatedModels = [];
		const ready = Pipedrive.Ready(fieldsKeysToFetch, function() {
			callback(relatedModels);
		});

		fieldsKeysToFetch.forEach(function(fieldKey) {
			const ModelClass = RELATED_OBJECTS_MODELS[fieldKey];
			const modelId = data[fieldKey];
			const model = new ModelClass({ id: modelId });
			const markReady = ready.set.bind(ready, fieldKey);

			if (_.get(existingRelatedModels, [model.type, modelId].join('.'))) {
				return markReady();
			}

			model.pull({
				error: markReady,
				success: function(model) {
					relatedModels.push(model);
					markReady();
				}
			});
		});
	}
};

module.exports = BulkEditUtils;
