import { PDMetrics } from '@pipedrive/react-utils';

import { ViewState } from '../store/bulkEditSlice';

import { ActionType, EntityType, ResponseType } from '../types';

let metrics: PDMetrics;

function trackUsage(component: string, action: string, passedData) {
	if (!metrics) {
		return;
	}

	metrics.trackUsage(null, component, action, passedData);
}

export function setMetricsInstance(metricsInstance: PDMetrics) {
	metrics = metricsInstance;
}

function extractListViewData(state: ViewState) {
	return {
		list_view_type: state.entityType,
		select_all_applied: !!state.criteria.bulkEditFilter,
		selected_items_count: state.selectedItemsCount,
		rows_displayed_count: state.visibleCount,
	};
}

export function trackBulkDeleteStarted(state: ViewState) {
	trackUsage('list_items', 'bulk_delete_started', extractListViewData(state));
}

export function trackBulkDeleteCanceled(state: ViewState) {
	trackUsage('list_items', 'bulk_delete_canceled', extractListViewData(state));
}

function extractFieldsTrackingData(formState: ViewState) {
	const fieldsModified = Object.keys(formState);
	const fieldsFiltered = {
		emptied_fields: fieldsModified.filter((k) => formState[k] === null),
		replaced_fields: fieldsModified.filter((k) => formState[k] !== null),
	};

	return {
		fields_count: fieldsModified.length,
		...fieldsFiltered,
		emptied_fields_count: fieldsFiltered.emptied_fields.length,
		replaced_fields_count: fieldsFiltered.replaced_fields.length,
	};
}

function extractCommonBulkEditData(formState, state: ViewState) {
	const fieldAggregations = extractFieldsTrackingData(formState);
	const listViewData = extractListViewData(state);

	return {
		...listViewData,
		...fieldAggregations,
	};
}

export function trackBulkEditStarted(formState, state: ViewState) {
	trackUsage('list_items', 'bulk_edit_started', extractCommonBulkEditData(formState, state));
}

export function trackBulkEditCanceled(formState, state: ViewState, source: 'sidebar' | 'modal') {
	trackUsage('list_items', 'bulk_edit_canceled', {
		...extractCommonBulkEditData(formState, state),
		source,
	});
}

export function trackBulkActionCompletedSnackbarShown(type: EntityType, action: ActionType, apiData: ResponseType) {
	trackUsage('list_items', 'bulk_action_completed_snackbar_shown', {
		list_view_type: type,
		action_type: action,
		selected_items_count: apiData.total_count,
		number_of_items_succeeded: apiData.succeeded_count,
		number_of_items_failed: apiData.failed_count,
	});
}

export function trackBulkActionCompletedModalOpened(type: EntityType, action: ActionType, apiData: ResponseType) {
	trackUsage('list_items', 'bulk_action_details_modal_opened', {
		list_view_type: type,
		action_type: action,
		selected_items_count: apiData.total_count,
		number_of_items_succeeded: apiData.succeeded_count,
		number_of_items_failed: apiData.failed_count,
	});
}

export function trackBulkActionStopped(type: EntityType, action: ActionType, apiData: ResponseType) {
	trackUsage('list_items', 'bulk_action_stopped', {
		list_view_type: type,
		action_type: action,
		selected_items_count: apiData.total_count,
		number_of_items_succeeded: apiData.succeeded_count,
		number_of_items_failed: apiData.failed_count,
	});
}
