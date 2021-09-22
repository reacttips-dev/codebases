import { graphql, readInlineData } from '@pipedrive/relay';
import { constants } from 'Utils/metrics/events/utils/constants';

import type { bulkArchived_tracking_data$key } from './__generated__/bulkArchived_tracking_data.graphql';

export function bulkArchived(
	bulkResultRef: bulkArchived_tracking_data$key,
	rowsDisplayedCount: number,
	selectAllApplied: boolean,
) {
	const data = readInlineData(
		graphql`
			fragment bulkArchived_tracking_data on BulkSuccessResult @inline {
				changedRecordsCount
			}
		`,
		bulkResultRef,
	);

	return {
		component: 'list_items',
		eventAction: 'bulk_archived',
		eventData: {
			list_view_type: 'lead',
			page: constants.PAGE,
			rows_displayed_count: rowsDisplayedCount,
			select_all_applied: selectAllApplied,
			select_items_count: data.changedRecordsCount,
			view_code: constants.VIEW_CODE,
		},
	};
}
