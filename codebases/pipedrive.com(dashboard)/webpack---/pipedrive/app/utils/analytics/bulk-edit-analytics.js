const _ = require('lodash');
const Pipedrive = require('pipedrive');
const logger = new Pipedrive.Logger('bulk-edit-analytics');
const PDMetrics = require('utils/pd-metrics');

const bulkEditSaveDetails = function(opts) {
	const data = opts.data;
	const objectType = opts.objectType;
	const id = _.makeid();

	_.forEach(data, (changedFieldValue, changedFieldKey) => {
		const eventData = {
			change_type: _.isNull(changedFieldValue) ? 'delete' : 'update',
			field_key: changedFieldKey,
			object_type: objectType,
			bulk_edit_correlation_id: id
		};

		if (_.isArray(changedFieldValue)) {
			_.assignIn(eventData, {
				field_item_count: changedFieldValue.length
			});
		}

		PDMetrics.trackUsage(null, 'bulk_edit_component', 'save_details', eventData);
	});
};

const getBulkEditUsageEventName = function(resolution) {
	switch (resolution) {
		case 'save':
			return 'bulk_edit_saved';
		case 'cancel':
			return 'bulk_edit_canceled';
		case 'delete':
			return 'bulk_deleted';
		default:
			return '';
	}
};

const getFilterMetrics = function(collection) {
	const filter = collection.bulkEditFilter;

	if (!filter) {
		return {};
	}

	let type = '';

	if (filter.everyone === 1) {
		type = 'everyone';
	} else if (filter.user_id) {
		type = 'user';
	} else if (filter.filter_id) {
		type = 'filter';
	}

	return {
		filterType: type,
		hasTypeQuickfilter: !!filter.type,
		hasStatusQuickfilter: !!(filter.start_date || filter.end_date),
		hasAlphabetFilter: !!filter.first_char
	};
};

const getBulkEditEventProperties = function(
	resolution,
	{ collection, listSettings, fieldsView, summary }
) {
	const type = collection.type;
	const isSelectAllFilterApplied = !!collection.bulkEditFilter;
	const totalItemsCount = listSettings.getSummary().get('total_count');
	const fieldsMetrics = fieldsView ? fieldsView.getMetrics() : {};
	const rowCount = collection.selectedIds
		? collection.selectedIds.length
		: summary.get('total_count');
	const editedFieldsCount = fieldsMetrics.editedFieldsCount;
	const emptiedFieldsCount = fieldsMetrics.emptiedFieldsCount;
	const emptiedFields = fieldsMetrics.emptiedFieldsNames;

	if (resolution === 'delete') {
		return {
			list_view_type: type,
			select_all_applied: isSelectAllFilterApplied,
			selected_items_count: isSelectAllFilterApplied ? totalItemsCount : rowCount,
			rows_displayed_count: collection.length
		};
	} else {
		return {
			list_view_type: type,
			fields_count: fieldsView.getFieldsCount(),
			selected_items_count: isSelectAllFilterApplied ? totalItemsCount : rowCount,
			rows_displayed_count: collection.length,
			edited_fields_count: editedFieldsCount,
			emptied_fields_count: emptiedFieldsCount,
			replaced_fields_count: editedFieldsCount - emptiedFieldsCount,
			emptied_fields: emptiedFields,
			replaced_fields: _.difference(fieldsMetrics.editedFieldsNames, emptiedFields),
			select_all_applied: isSelectAllFilterApplied,
			...getFilterMetrics(collection)
		};
	}
};

module.exports = {
	init: function() {
		app.global.bind('track.bulkedit.save.details', bulkEditSaveDetails);
	},

	trackBulkEditUsage: function(resolution, { collection, listSettings, fieldsView, summary }) {
		try {
			const eventName = getBulkEditUsageEventName(resolution);
			const properties = getBulkEditEventProperties(resolution, {
				collection,
				listSettings,
				fieldsView,
				summary
			});

			PDMetrics.trackUsage(null, 'list_items', eventName, properties);
		} catch (error) {
			logger.error(error, 'Could not report bulk edit analytics');
		}
	}
};
