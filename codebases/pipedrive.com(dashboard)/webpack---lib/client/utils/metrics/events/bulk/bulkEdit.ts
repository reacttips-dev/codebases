import { getLeadsInboxPage } from 'Utils/metrics/events/utils/getLeadsInboxPage';
import { constants } from 'Utils/metrics/events/utils/constants';
import { LeadFilterStatus } from 'Types/types';

import { FIELDS_COUNT } from './utils/FIELDS_COUNT';
import { getEditedFields, SupportedTrackingFields } from './utils/getTrackingFields';

type EventParameters = {
	readonly emptiedFields: SupportedTrackingFields;
	readonly replacedFields: SupportedTrackingFields;
	readonly leadFilterStatus: LeadFilterStatus;
	readonly totalVisibleCount: number;
	readonly affectingEverything: boolean;
	readonly totalSelectedCount: number;
};

function eventData(params: EventParameters) {
	const { emptiedFields, replacedFields, totalVisibleCount, affectingEverything, totalSelectedCount } = params;

	return {
		edited_fields_count: getEditedFields(emptiedFields, replacedFields).length,
		emptied_fields: emptiedFields,
		emptied_fields_count: emptiedFields.length,
		fields_count: FIELDS_COUNT,
		list_view_type: 'lead',
		page: constants.PAGE,
		replaced_fields: replacedFields,
		replaced_fields_count: replacedFields.length,
		rows_displayed_count: totalVisibleCount,
		select_all_applied: affectingEverything,
		select_items_count: totalSelectedCount,
		view_code: constants.VIEW_CODE,
		leads_inbox_page: getLeadsInboxPage(params.leadFilterStatus),
	};
}

export function bulkEditSaved(parameters: EventParameters) {
	return {
		component: 'list_items',
		eventAction: 'bulk_edit_saved',
		eventData: eventData(parameters),
	};
}

export function bulkEditCancelled(parameters: EventParameters) {
	return {
		component: 'list_items',
		eventAction: 'bulk_edit_cancelled',
		eventData: eventData(parameters),
	};
}
