import autoMarkConversationAsRead from '../../helpers/autoMarkConversationAsRead';
import autoMarkItemAsRead from '../../helpers/autoMarkItemAsRead';
import type MarkReadStore from '../../store/schema/MarkReadStore';
import markReadStore from '../../store/Store';
import { doesTableSupportAutoMarkRead, TableView } from 'owa-mail-list-store';
import getSelectedTableView from 'owa-mail-list-store/lib/utils/getSelectedTableView';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { action } from 'satcheljs/lib/legacy';

export interface AutoMarkAsReadTimerState {
    store: MarkReadStore;
}

/**
 * Set the auto mark as read timer
 * @param id the conversation id or item id used to set the timer
 * @param state the AutoMarkAsReadTimerState which contains mark read store and delay time
 */
export let setAutoMarkAsReadTimer = action('setAutoMarkAsReadTimer')(
    function setAutoMarkAsReadTimer(
        id: string,
        isItemPart?: boolean,
        state: AutoMarkAsReadTimerState = { store: markReadStore }
    ) {
        // Setup timer only if the user option setting is mark as read on delay
        const userOptions = getUserConfiguration().UserOptions;
        if (userOptions.PreviewMarkAsRead == 'Delayed') {
            const tableView = getSelectedTableView();
            // Do not setup the timer if
            // tableView is undefined, this could happen when RP is opened from photohub OR
            // tableView does not support auto mark as read
            if (!tableView || !doesTableSupportAutoMarkRead(tableView)) {
                return;
            }
            state.store.markAsReadTimerTask = setTimeout(() => {
                onMarkAsReadTimeout(id, tableView, isItemPart);
            }, userOptions.MarkAsReadDelaytime * 1000);
        }
    }
);

/**
 * Clear the auto mark as read timer
 * @param state the state which contains the mark read store
 */
export let clearAutoMarkAsReadTimer = action('clearAutoMarkAsReadTimer')(
    function clearAutoMarkAsReadTimer(state: AutoMarkAsReadTimerState = { store: markReadStore }) {
        if (state.store.markAsReadTimerTask) {
            clearTimeout(state.store.markAsReadTimerTask);
            state.store.markAsReadTimerTask = null;
        }
    }
);

/**
 * Callback when markAsReadTimer timeout
 * @param id the conversation id or item id to be marked as read
 * @param tableView the table view
 */
const onMarkAsReadTimeout = action('setMarkAsReadTimer:timeout')(
    (id: string, tableView: TableView, isItemPart: boolean) => {
        clearAutoMarkAsReadTimer();

        if (isItemPart) {
            autoMarkItemAsRead(id, tableView);
            return;
        }

        if (
            tableView.tableQuery.listViewType === ReactListViewType.Message ||
            shouldShowUnstackedReadingPane()
        ) {
            autoMarkItemAsRead(id, tableView);
        } else {
            autoMarkConversationAsRead(id, tableView);
        }
    }
);
