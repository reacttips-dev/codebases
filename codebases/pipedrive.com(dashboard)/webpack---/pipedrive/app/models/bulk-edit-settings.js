const Pipedrive = require('pipedrive');
const _ = require('lodash');
const BulkEditUtils = require('utils/bulk-edit-utils');

const BulkEditSettings = function(options) {
	options = options || {};

	this.collection = options.collection;
	this.listSettings = options.listSettings;

	this.collection.selectedIds = [];
	this.collection.excludedIds = [];

	this.checkboxState = {
		checked: false,
		indeterminate: false
	};

	this.listenToChanges();
};

_.assignIn(
	BulkEditSettings.prototype,
	{
		listenToChanges: function() {
			const resetOnEvents = [
				'changed:custom-view',
				'reset:first-letter',
				'changed:first-letter',
				'changed:filter',
				'changed:custom-filter'
			];

			this.collection.on('selected', this.setCheckboxState, this);
			this.listSettings.on(resetOnEvents.join(' '), this.setCheckboxState, this);
		},

		selectAll: function(checked) {
			if (this.collection.bulkEditFilter) {
				_.unset(this.collection, 'bulkEditFilter');
			}

			this.collection.selectedIds = [];
			this.collection.excludedIds = [];

			if (checked) {
				this.collection.bulkEditFilter = BulkEditUtils.getBulkEditByFilter(
					this.listSettings
				);
			}

			this.collection.trigger('selected', checked);
		},

		onCheckboxSelected: function(model, checked) {
			const modelId = model.get('id');

			let modelInCollection;

			if (this.collection.bulkEditFilter) {
				modelInCollection = _.indexOf(this.collection.excludedIds, modelId);

				if (modelInCollection < 0) {
					this.collection.excludedIds.push(modelId);
				} else {
					this.collection.excludedIds = _.without(this.collection.excludedIds, modelId);
				}
			} else {
				modelInCollection = _.indexOf(this.collection.selectedIds, modelId);

				if (modelInCollection < 0) {
					this.collection.selectedIds.push(modelId);
				} else {
					this.collection.selectedIds = _.without(this.collection.selectedIds, modelId);
				}
			}

			model.trigger('selected', checked);
		},

		setCheckboxState: function() {
			const totalCount = this.listSettings.getSummary().get('total_count');
			const hasSelectedItems = BulkEditUtils.hasSelectedItems(this.collection, totalCount);
			const allItemsSelected = BulkEditUtils.allItemsSelected(this.collection, totalCount);

			this.checkboxState.indeterminate = hasSelectedItems && !allItemsSelected;
			this.checkboxState.checked = hasSelectedItems || allItemsSelected;

			this.trigger('changed:selectAllCheckbox', this.checkboxState);
		}
	},
	Pipedrive.Events
);

module.exports = BulkEditSettings;
