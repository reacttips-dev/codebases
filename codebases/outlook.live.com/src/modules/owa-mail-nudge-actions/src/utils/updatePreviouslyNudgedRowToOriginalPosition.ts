import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';
import findOrderedIndexToInsertAt from 'owa-mail-triage-table-utils/lib/findIndexToInsertAt';
import { trySelectNextRowUponTriageAction } from 'owa-mail-triage-local-updates/lib/utils/trySelectNextRowUponTriageAction';
import { MailRowDataPropertyGetter, TableView } from 'owa-mail-list-store';
import TableOperations from 'owa-mail-list-table-operations';
import { doesRowBelongToNudgeSection } from 'owa-mail-nudge-store';

export default function updatePreviouslyNudgedRowToOriginalPosition(
    rowKey: string,
    tableView: TableView
) {
    // update unpinned previously nudged rows to its proper position
    // previously nudged row could be deleted by the time new nudges comes in asynchronously
    // and we try to update its position
    const currentIndex = tableView.rowKeys.indexOf(rowKey);
    if (currentIndex == -1) {
        return;
    }

    const lastDeliveryOrRenewTimeStamp = MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(
        rowKey,
        tableView
    );

    if (!doesRowBelongToNudgeSection(rowKey, tableView.id, lastDeliveryOrRenewTimeStamp)) {
        return;
    }

    // Row belongs to Nudge section, find ordered original index to insert the row at
    let indexToInsertAt = findOrderedIndexToInsertAt(
        lastDeliveryOrRenewTimeStamp,
        MailRowDataPropertyGetter.getLastDeliveryTimeStamp(rowKey, tableView),
        tableView,
        currentIndex + 1 /*startIndex*/
    );

    if (indexToInsertAt == -1) {
        // Remove the row if it could not placed, because the row could have moved down (and out of loaded range)
        // for any reason from another client
        removeRowsFromListViewStore([rowKey], tableView, 'NotNudgeAnymore');
    } else {
        // Select next row upon nudge action resulting in row position update
        trySelectNextRowUponTriageAction([rowKey], tableView);

        // decrease 1 index because indexToInsertAt is calculated based on
        // the row still in the nudged position in the table
        TableOperations.updateRowPosition(--indexToInsertAt, rowKey, tableView);
    }
}
