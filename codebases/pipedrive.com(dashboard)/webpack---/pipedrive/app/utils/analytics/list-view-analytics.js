const _ = require('lodash');
const User = require('models/user');
const PDMetrics = require('utils/pd-metrics');

('use strict');

function getListViewOpenedMetrics(listSettings) {
	const itemCountPropertyName = getItemCountPropertyName(listSettings);

	return {
		[itemCountPropertyName]: listSettings.getSummary().get('total_count'),
		column_count: listSettings.getCustomView().get('fields').length
	};
}

function getItemCountPropertyName(listSettings) {
	const listViewType = listSettings.collection.type;

	return `${listViewType}_count`;
}

function getListViewComponentName(listSettings) {
	const listViewType = listSettings.collection.type;

	return `${listViewType}_list`;
}

function getListViewExportMetrics(collection, format, rowCount) {
	const fields = collection.options.fields;
	const fieldTypes =
		fields &&
		_.uniq(
			fields.map((field) => {
				return typeof field === 'string' ? collection.type : field.type;
			})
		);

	return {
		list_view_type: fields ? collection.type : 'other',
		file_type: format,
		row_count: rowCount,
		column_count: fields && fields.length,
		datasets: fieldTypes
	};
}

module.exports = {
	/**
	 * Tracks time spent on page loading
	 * @param  object opts Options for logging page action
	 * 	listType: string representing list type (deal, activity, person, organization)
	 * 	loadingStart: number representing start time of tracking
	 * 	additionalMetrics: object for adding additional params to send to new relic
	 * @return void
	 */
	trackPageLoad: function(opts) {
		const options = opts || {};
		const loadingFinish = new Date().getTime();

		PDMetrics.addPageAction(
			'list:actions',
			_.assignIn(
				{
					'list.action': 'loading',
					'list.type': options.listType,
					'loadingTime': loadingFinish - options.loadingStart
				},
				options.additionalMetrics
			)
		);
	},

	trackListViewOpened: function(listSettings) {
		const promise = new Promise((resolve) => {
			if (_.isNil(listSettings.getSummary().get('total_count'))) {
				listSettings.getSummary().once('sync', resolve);
			} else {
				resolve();
			}
		});

		promise.then(() => {
			const attributes = getListViewOpenedMetrics(listSettings);

			PDMetrics.trackUsage(
				null,
				getListViewComponentName(listSettings),
				'opened',
				attributes
			);
		});
	},

	trackListViewColumnReordering: function(field, oldIndex, newIndex, customView) {
		const isCustomField = User.fields.getByKey(field.item_type, field.key).edit_flag;

		PDMetrics.trackUsage(null, 'list_view_columns', 'reordered', {
			list_view_type: customView.get('view_type'),
			column_count: customView.get('fields').length,
			is_custom_field: isCustomField,
			field_key: `${field.item_type}.${field.key}`,
			old_index: oldIndex,
			new_index: newIndex
		});
	},

	trackAddedAndRemovedListViewColumns: function(fieldsBeforeUpdate, fieldsAfterUpdate, viewType) {
		const addedColumns = _.differenceBy(fieldsAfterUpdate, fieldsBeforeUpdate, 'key');
		const removedColumns = _.differenceBy(fieldsBeforeUpdate, fieldsAfterUpdate, 'key');

		PDMetrics.trackUsage(null, 'list_view_columns', 'updated', {
			list_view_type: viewType,
			column_count: fieldsAfterUpdate.length,
			columns_added_count: addedColumns.length,
			columns_removed_count: removedColumns.length,
			columns_added: addedColumns.map((field) => `${field.item_type}.${field.key}`),
			columns_removed: removedColumns.map((field) => `${field.item_type}.${field.key}`)
		});
	},

	trackListViewExport: function(collection, format, rowCount) {
		PDMetrics.trackUsage(
			null,
			'list_items',
			'exported',
			getListViewExportMetrics(collection, format, rowCount)
		);
	},

	trackListViewCanceledExport: function(collection, format, rowCount) {
		PDMetrics.trackUsage(
			null,
			'list_items',
			'export_canceled',
			getListViewExportMetrics(collection, format, rowCount)
		);
	}
};
