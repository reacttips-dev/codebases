import type GroupHeaderGenerator from '../type/GroupHeaderGenerator';
import { NoGroupHeaderId } from 'owa-mail-group-headers';
import type { TableView } from 'owa-mail-list-store';
import { trace } from 'owa-trace';

// VSO16501: https://outlookweb.visualstudio.com/Outlook%20Web/Triage%20React/_workitems/edit/16501
/**
 * Calculates if a header should be shown between two rows and returns the header text
 * @param previousRowKey rowKey of previous row
 * @param currentRowKey rowKey of current row
 * @param tableView table view
 * @param headerGenerator the header generator for current table
 * @return header to be displayed
 */
export default function getMailListGroupHeader(
    previousRowKey: string,
    currentRowKey: string,
    tableView: TableView,
    headerGenerator: GroupHeaderGenerator
): string {
    if (!currentRowKey) {
        trace.warn('getMailListGroupHeader: currentRowKey is not supposed to be null.');
        return null;
    }

    // Return null if
    // 1. Group Headers getter is null
    // 2. previous row is null when the listview is empty or for the first row in listview
    if (
        !headerGenerator.getGroupHeader ||
        (headerGenerator.hideFirstHeader && previousRowKey == null)
    ) {
        return null;
    }

    const previousHeader = previousRowKey
        ? headerGenerator.getGroupHeader(previousRowKey, tableView)
        : { headerId: NoGroupHeaderId.None };
    const currentHeader = headerGenerator.getGroupHeader(currentRowKey, tableView);

    // If an item is not in defined group ranges return none type. It should be very rare but in the
    // past we have seen instances of Tomorrow header e.g. in case timer callback is not triggered.
    // return header text of current row if previous row header type is different from current row type header
    if (
        currentHeader.headerId != NoGroupHeaderId.None &&
        previousHeader.headerId != currentHeader.headerId
    ) {
        return currentHeader.headerText();
    }

    return null;
}
