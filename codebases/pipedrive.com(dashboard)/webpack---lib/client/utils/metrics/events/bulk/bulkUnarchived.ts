import { graphql, readInlineData } from '@pipedrive/relay';
import { LeadFilterStatus } from 'Types/types';
import { constants } from 'Utils/metrics/events/utils/constants';
import { getLeadsInboxPage } from 'Utils/metrics/events/utils/getLeadsInboxPage';

import type { bulkUnarchived_tracking_data$key } from './__generated__/bulkUnarchived_tracking_data.graphql';

type BulkUnarchive = {
	leadFilterStatus: LeadFilterStatus;
	bulkResultRef: bulkUnarchived_tracking_data$key;
	rowsDisplayedCount: number;
	selectAllApplied: boolean;
};

export function bulkUnarchived({
	leadFilterStatus,
	bulkResultRef,
	rowsDisplayedCount,
	selectAllApplied,
}: BulkUnarchive) {
	const data = readInlineData(
		graphql`
			fragment bulkUnarchived_tracking_data on BulkSuccessResult @inline {
				changedRecordsCount
			}
		`,
		bulkResultRef,
	);

	return {
		component: 'list_items',
		eventAction: 'bulk_unarchived',
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
