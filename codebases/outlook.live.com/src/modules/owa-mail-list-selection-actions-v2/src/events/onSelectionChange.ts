import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import setTableIsInCheckedMode from '../internal/mutators/setTableIsInCheckedMode';
import tableExitVirtualSelectAllMode from '../internal/mutators/tableExitVirtualSelectAllMode';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import {
    PerformanceDatapoint,
    DatapointStatus,
    returnTopExecutingActionDatapoint,
    logUsage,
} from 'owa-analytics';
import { lazyPrefetchAdjacentRowsOnDelay } from 'owa-mail-prefetch';
import onListViewSelectionChange from '../internal/onListViewSelectionChange';
import { setShowReadingPane } from 'owa-mail-layout/lib/actions/setShowReadingPane';
import {
    isReadingPanePositionBottom,
    isReadingPanePositionRight,
} from 'owa-mail-layout/lib/selectors/readingPanePosition';

let propagateSelectionTask: NodeJS.Timer;
let lastSelectMailItemDatapoint: PerformanceDatapoint;

/**
 * Called when there is a selection change in list view. This function will then trigger event to external
 * owa-mail-module-orchestrator to propagate selection change event
 * @param tableView The tableview
 * @param isUserNavigation Did user initiate selection
 * @param mailListItemSelectionSource The source of selection on mail item
 */
export default function onSelectionChange(
    tableView: TableView,
    isUserNavigation: boolean,
    mailListItemSelectionSource: MailListItemSelectionSource
): Promise<void> {
    const selectedItemsCount = tableView.selectedRowKeys.size;
    if (selectedItemsCount > 0 && tableView.isInVirtualSelectAllMode) {
        // We have items selected, exit virtual selection mode if we're in it
        tableExitVirtualSelectAllMode(tableView);
    } else if (selectedItemsCount == 0 && !tableView.isInVirtualSelectAllMode) {
        // Nothing selected - reset checked mode
        setTableIsInCheckedMode(tableView, false);
    }

    if (selectedItemsCount == 1) {
        const rowKey = [...tableView.selectedRowKeys.keys()][0];
        lazyPrefetchAdjacentRowsOnDelay.importAndExecute(rowKey, tableView);
    }

    // We only need to honor the latest user selection
    if (propagateSelectionTask) {
        clearTimeout(propagateSelectionTask);
        propagateSelectionTask = null;
    }

    if (lastSelectMailItemDatapoint) {
        // Record whether or not datapoint has already ended before force ending
        const hasEnded = lastSelectMailItemDatapoint.hasEnded;

        // end SelectMailItem datapoint from the previous selection
        lastSelectMailItemDatapoint.end(undefined /*duration*/, DatapointStatus.BackgroundSuccess);

        // Log abandonments if datapoint lasted longer than half a second (to reduce noise).
        // Must end the datapoint first to get elapsed time
        if (!hasEnded && lastSelectMailItemDatapoint?.properties?.E2ETimeElapsed > 500) {
            logUsage(
                'SelectMailItemAbandoned',
                [
                    lastSelectMailItemDatapoint?.properties?.E2ETimeElapsed,
                    lastSelectMailItemDatapoint?.propertyBag?.owa_1, // MailListItemSelectionSource
                    lastSelectMailItemDatapoint?.propertyBag?.owa_7, // true if in 3 col view
                    lastSelectMailItemDatapoint?.propertyBag?.owa_8, // index
                ],
                { sessionSampleRate: 10 }
            );
        }
    }

    lastSelectMailItemDatapoint = returnTopExecutingActionDatapoint((dp: PerformanceDatapoint) => {
        return dp.eventName == 'SelectMailItem';
    });
    if (mailListItemSelectionSource === MailListItemSelectionSource.SearchSuggestionClick) {
        // do not yield to let browser render list view. Search suggestion
        // opens into immersive reading pane directly with reading pane off.
        // The setTimeout causes list view to render briefly before
        // immersive reading pane is shown
        onListViewSelectionChange(
            tableView,
            isUserNavigation,
            mailListItemSelectionSource,
            lastSelectMailItemDatapoint
        );

        return Promise.resolve();
    }

    if (
        mailListItemSelectionSource === MailListItemSelectionSource.MailListItemContextMenu &&
        (isReadingPanePositionRight() || isReadingPanePositionBottom())
    ) {
        setShowReadingPane(false /* showReadingPane */);
    }

    const promiseToReturn = new Promise<void>((resolve, reject) => {
        // Propagate the listview selection on delay so we allow the browser to render
        // listview selection change separately. setTimeout releases the javascript thread
        lastSelectMailItemDatapoint && lastSelectMailItemDatapoint.addCheckpoint('PRE_ONVSC');
        propagateSelectionTask = setTimeout(() => {
            propagateSelectionTask = null;

            onListViewSelectionChange(
                tableView,
                isUserNavigation,
                mailListItemSelectionSource,
                lastSelectMailItemDatapoint
            )
                .then(() => {
                    resolve();
                })
                .catch((error: Error) => {
                    reject(error);
                });
        }, 1);
    });

    return promiseToReturn;
}
