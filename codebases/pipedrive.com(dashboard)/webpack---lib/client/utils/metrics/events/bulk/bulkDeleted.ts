import { graphql, readInlineData } from '@pipedrive/relay';
import { LeadFilterStatus } from 'Types/types';
import { constants } from 'Utils/metrics/events/utils/constants';
import { getLeadsInboxPage } from 'Utils/metrics/events/utils/getLeadsInboxPage';

import type { bulkDeleted_tracking_data$key } from './__generated__/bulkDeleted_tracking_data.graphql';

type BulkDeleted = {
	leadFilterStatus: LeadFilterStatus;
	bulkResultRef: bulkDeleted_tracking_data$key;
	rowsDisplayedCount: number;
	selectAllApplied: boolean;
};

export function bulkDeleted({ leadFilterStatus, bulkResultRef, rowsDisplayedCount, selectAllApplied }: BulkDeleted) {
	const data = readInlineData(
		graphql`
			fragment bulkDeleted_tracking_data on BulkSuccessResult @inline {
				changedRecordsCount
			}
		`,
		bulkResultRef,
	);

	return {
		component: 'list_items',
		eventAction: 'bulk_deleted',
		eventData: {
			list_view_type: 'lead',
			page: constants.PAGE,
			rows_displayed_count: rowsDisplayedCount, // total number of rows in the list view
			select_all_applied: selectAllApplied, // user has checked the "select all" checkbox at the top of the list
			select_items_count: data.changedRecordsCount, // number of items included in the bulk delete
			view_code: constants.VIEW_CODE,
			leads_inbox_page: getLeadsInboxPage(leadFilterStatus),
		},
	};
}
