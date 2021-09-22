import { noneGroupHeader } from 'owa-mail-group-headers/lib/utils/timeGroupHeaderGenerator.locstring.json';
import { userDate } from 'owa-datetime';
import {
    getTimeGroupHeader,
    NudgedGroupHeaderId,
    NoGroupHeaderId,
    TimeGroupHeader,
    PinnedGroupHeaderId,
} from 'owa-mail-group-headers';
import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import { MailRowDataPropertyGetter, TableView } from 'owa-mail-list-store';
import { doesRowBelongToNudgeSection } from 'owa-mail-nudge-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { pinned } from '../strings.locstring.json';
import loc from 'owa-localize';
import { logUsage } from 'owa-analytics';

/**
 * Get TimeGroupHeader for item
 * @param rowKey item key for which we want to lookup time group range
 * @param tableView tableView
 * @return group header for this row
 */
export default function getGroupHeaderForSortByDateTime(
    rowKey: string,
    tableView: TableView
): TimeGroupHeader {
    /**
     * Nudged rows do not stay in date time sort order
     * return now instead of looking up the time header
     */
    const isTableSortedByRenewTime = shouldTableSortByRenewTime(tableView.tableQuery);
    if (
        doesRowBelongToNudgeSection(
            rowKey,
            tableView.id,
            MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(rowKey, tableView)
        )
    ) {
        return {
            headerText: () => '',
            headerId: NudgedGroupHeaderId.Nudged,
            rangeStartTime: null,
            rangeEndTime: null,
        };
    } else if (
        MailRowDataPropertyGetter.getIsPinned(rowKey, tableView) &&
        isTableSortedByRenewTime
    ) {
        // We want to make sure that we only show the pinned header
        return {
            headerText: () => loc(pinned),
            headerId: PinnedGroupHeaderId.Pinned,
            rangeStartTime: null,
            rangeEndTime: null,
        };
    } else {
        let propertyGetter: (rowKey: string, tableView: TableView) => string;
        if (isTableSortedByRenewTime) {
            propertyGetter = MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp;
        } else if (folderNameToId('drafts') == tableView.tableQuery.folderId) {
            propertyGetter = MailRowDataPropertyGetter.getLastModifiedTimeStamp;
        } else {
            propertyGetter = MailRowDataPropertyGetter.getLastDeliveryTimeStamp;
        }

        try {
            const timeStamp = propertyGetter(rowKey, tableView);
            const date = userDate(timeStamp);

            return getTimeGroupHeader(date);
        } catch (e) {
            const logSystemFolder = tableView.tableQuery.folderId
                ? folderIdToName(tableView.tableQuery.folderId)
                : null;
            logUsage('TnS_DateTimeNotFound', [logSystemFolder]);

            return {
                headerText: () => loc(noneGroupHeader),
                headerId: NoGroupHeaderId.None,
                rangeStartTime: null,
                rangeEndTime: null,
            };
        }
    }
}
