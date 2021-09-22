import {
    PerformanceDatapoint,
    returnTopExecutingActionDatapoint,
    DatapointStatus,
} from 'owa-analytics';
import type MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { TableView, MailRowDataPropertyGetter, TableQueryType } from 'owa-mail-list-store';
import { doesRowBelongToNudgeSection, getNudgeItemId } from 'owa-mail-nudge-store';
import { isReadingPanePositionOff } from 'owa-mail-layout';
import { getAggregationBucket } from 'owa-analytics-actions';

export function endSelectMailItemDatapoint(shouldInvalidate?: boolean) {
    const dp = returnTopExecutingActionDatapoint((dp: PerformanceDatapoint) => {
        return dp.eventName == 'SelectMailItem' || dp.eventName == 'SelectMailItemNonCritical';
    });
    if (dp) {
        shouldInvalidate
            ? dp.invalidate()
            : dp.end(undefined /*duration*/, DatapointStatus.BackgroundSuccess);
    }
}

export function addCustomDataToSelectMailItemDatapoint(
    mailListItemSelectionSource: MailListItemSelectionSource,
    tableView: TableView,
    rowKey: string
) {
    const dp = returnTopExecutingActionDatapoint((dp: PerformanceDatapoint) => {
        return dp.eventName == 'SelectMailItem' || dp.eventName == 'SelectMailItemNonCritical';
    });
    if (dp) {
        const validCouponIndexes = MailRowDataPropertyGetter.getValidCouponIndexes(
            rowKey,
            tableView
        );
        const isNudge = doesRowBelongToNudgeSection(
            rowKey,
            tableView.id,
            MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(rowKey, tableView)
        );

        let nudgeItemId = null;
        if (isNudge) {
            nudgeItemId = getNudgeItemId(rowKey);
        }

        dp.addCustomData([
            mailListItemSelectionSource,
            tableView.tableQuery.listViewType,
            tableView.tableQuery.type,
            tableView.tableQuery.type === TableQueryType.Search &&
                (tableView.tableQuery as any).searchScope.kind,
            validCouponIndexes ? validCouponIndexes.length : 0,
            isNudge,
            !isReadingPanePositionOff(),
            getAggregationBucket({
                value: tableView.rowKeys.indexOf(rowKey),
                buckets: [10, 25, 50, 75, 100, 150, 200, 250, 300, 500],
                exactMatches: [-1, 0],
            }), // Row key index
            nudgeItemId, // Logged only if row was nudged.
        ]);
    }
}
