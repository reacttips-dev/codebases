import { listViewStore, isItemPartOperation, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import { getItemToShowFromNodeId } from 'owa-mail-store/lib/utils/conversationsUtils';
import getItemIdsToShowFromNodeOrThreadIds from 'owa-mail-store/lib/selectors/getItemIdsToShowFromNodeOrThreadIds';
import { isFirstLevelExpanded } from 'owa-mail-list-store/lib/selectors/isConversationExpanded';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import type FlagType from 'owa-service/lib/contract/FlagType';
import type Message from 'owa-service/lib/contract/Message';
import {
    lazySetItemsFlagStateFromItemIds,
    lazySetMailListRowsFlagState,
} from 'owa-mail-triage-action';
import type { ActionSource } from 'owa-analytics-types';

/**
 * Set item(s) to Flagged state.
 */
export function onFlag(actionSource: ActionSource) {
    onFlagUnflag(actionSource, { FlagStatus: 'Flagged' });
}

/**
 * Set item(s) to Not Flagged state.
 */
export function onUnflag(actionSource: ActionSource) {
    onFlagUnflag(actionSource, { FlagStatus: 'NotFlagged' });
}

/**
 * Set item(s) to Flagged or Not Flagged state based on current selected item's flag state(s).
 *
 * @param flagType will be used to set item's FlagType, and can be undefined.
 * If undefined, this function will calculate the FlagState given current selected item flag state(s).
 * This is to allow for "toggle" functionality, of wanting to toggle flag state without parent caller needing
 * to know current item's flag state.
 *
 * @param override is used for lazySetMailListRowsFlagState's override parameter, allowing for
 * an item to be updated with a new flag start/end date even if it's already flagged.
 *
 */
export function onFlagUnflag(actionSource: ActionSource, flagType?: FlagType, override?: boolean) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = tableView.isInVirtualSelectAllMode
        ? tableView.rowKeys
        : [...tableView.selectedRowKeys.keys()];
    const selectedNodeIds = listViewStore.expandedConversationViewState.selectedNodeIds;

    // If flagType is not given, manually find the flag status given current items' flag state
    // The logic to decide whether to mark the item(s) as flagged or unflagged is:
    // 1) If any of the item(s) are flagged, mark the entire selection as unflagged.
    // 2) Otherwise, mark the entire selection as flagged.
    if (flagType === undefined) {
        if (isItemPartOperation()) {
            // Conversation view
            for (const itemId of selectedNodeIds) {
                const item: Message = getItemToShowFromNodeId(itemId);
                if (item?.Flag?.FlagStatus === 'Flagged') {
                    flagType = { FlagStatus: 'NotFlagged' };
                    break;
                }
            }
        } else {
            // Mail List view
            for (const rowKey of rowKeys) {
                if (MailRowDataPropertyGetter.getFlagStatus(rowKey, tableView) === 'Flagged') {
                    flagType = { FlagStatus: 'NotFlagged' };
                    break;
                }
            }
        }

        // If after searching all items we did not find any that are flagged, then
        // we want to set all items to be flagged.
        if (flagType === undefined) {
            flagType = { FlagStatus: 'Flagged' };
        }
    }

    if (isItemPartOperation()) {
        const itemIds = getItemIdsToShowFromNodeOrThreadIds(
            selectedNodeIds,
            isFirstLevelExpanded(rowKeys[0])
        );
        lazySetItemsFlagStateFromItemIds.importAndExecute(
            itemIds,
            null /* instrumentationContexts */,
            flagType,
            tableView.id,
            actionSource
        );
    } else {
        lazySetMailListRowsFlagState.importAndExecute(
            rowKeys,
            tableView.id,
            flagType,
            actionSource,
            override
        );
    }

    lazyResetFocus.importAndExecute();
}
