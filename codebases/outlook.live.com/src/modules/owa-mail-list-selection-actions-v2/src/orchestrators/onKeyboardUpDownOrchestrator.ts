import * as mailListSelectionActionsV2 from 'owa-mail-actions/lib/mailListSelectionActions';
import {
    listViewStore,
    TableView,
    getTableConversationRelation,
    SelectionDirection,
} from 'owa-mail-list-store';
import {
    isFirstLevelExpanded,
    isSecondLevelExpanded,
} from 'owa-mail-list-store/lib/selectors/isConversationExpanded';
import getItemForMailList from 'owa-mail-store/lib/selectors/getItemForMailList';
import type Item from 'owa-service/lib/contract/Item';
import { orchestrator } from 'satcheljs';
import { default as onKeyboardUpDown } from 'owa-mail-actions/lib/onKeyboardUpDown';
import canConversationLoadMore from 'owa-mail-store/lib/utils/canConversationLoadMore';
import loadMore from 'owa-mail-reading-pane-store/lib/actions/loadMore';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import focusItemPart from 'owa-mail-actions/lib/focusItemPart';
import focusRowInDirection from 'owa-mail-actions/lib/focusRowInDirection';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';

// Orchestrator to select or focus the next row or item part on keyboard input
orchestrator(onKeyboardUpDown, actionMessage => {
    const {
        selectionDirection,
        tableView,
        mailListItemSelectionSource,
        shouldSelect,
    } = actionMessage;

    const [nextNodeId, nextItem] = getNextItemPart(selectionDirection, tableView);
    // Do nothing if loading more items
    if (nextNodeId === 'loading') {
        return;
    }
    // Select or focus next item part if valid
    if (nextNodeId) {
        shouldSelect
            ? mailListSelectionActionsV2.itemPartSelected(
                  nextNodeId,
                  nextItem.ItemId.Id,
                  listViewStore.expandedConversationViewState.allNodeIds,
                  tableView,
                  mailListItemSelectionSource
              )
            : focusItemPart(nextNodeId, mailListItemSelectionSource);
    }
    // Collapse the conversation on keyboard up if first item part selected
    else if (
        listViewStore.expandedConversationViewState.expandedRowKey &&
        (!shouldShowUnstackedReadingPane() ||
            listViewStore.expandedConversationViewState.forks?.length > 1 ||
            isSecondLevelExpanded(listViewStore.expandedConversationViewState.expandedRowKey)) &&
        selectionDirection === SelectionDirection.Previous
    ) {
        mailListSelectionActionsV2.keyboardCollapseConversation(
            listViewStore.expandedConversationViewState.expandedRowKey
        );
    }
    // Select or focus next row key
    else {
        shouldSelect
            ? mailListSelectionActionsV2.selectRowInDirection(
                  tableView,
                  selectionDirection,
                  mailListItemSelectionSource
              )
            : focusRowInDirection(tableView, selectionDirection, mailListItemSelectionSource);
    }
});

function getNextItemPart(
    selectionDirection: SelectionDirection,
    tableView: TableView
): [string, Item] {
    const { focusedNodeId, allNodeIds } = listViewStore.expandedConversationViewState;

    // Early return if there is no focused node (conversation is not expanded)
    if (!focusedNodeId) {
        return [null, null];
    }

    let index = allNodeIds.indexOf(focusedNodeId);
    let endOfListIndex, increment;
    selectionDirection === SelectionDirection.Next
        ? ((endOfListIndex = allNodeIds.length - 1), (increment = 1))
        : ((endOfListIndex = 0), (increment = -1));

    const rowId = getTableConversationRelation(tableView.focusedRowKey, tableView.id).id;
    const conversationItem = listViewStore.conversationItems.get(rowId);
    // Continue to iterate until either the end of list is reached or we get a valid item
    while (index !== endOfListIndex) {
        index += increment;

        // If moving into a load more button, just load the items
        if (
            canConversationLoadMore(conversationItem.id) &&
            isNavigatingToLoadMoreButton(index, allNodeIds.length, selectionDirection)
        ) {
            loadMore(conversationItem.clientId);
            return ['loading', null];
        }

        let nextNodeId = allNodeIds[index];
        let nextItem = getItemForMailList(
            nextNodeId,
            isFirstLevelExpanded(tableView.focusedRowKey)
        );
        // nextItem will be null when the next item is not currently in the view state. This can happen for multiple reasons,
        // such as being a deleted item or a draft. In that case, we want to continue iterating to see if the item is valid
        if (nextItem) {
            return [nextNodeId, nextItem];
        }
    }
    return [null, null];
}

// Returns true if:
// 1. Navigating to the beginning of the list with selection direction as previous and newest on bottom (load more on top)
// 2. Navigating to the second item of the list with selection direction as next and newest on bottom (load more on top)
// 3. Navigating to the last item of the list with selection direction as next and newest on top (load more on bottom)
// 4. Navigating to the second to last item of the list with selection direction as previous and newest on top (load more on bottom)
function isNavigatingToLoadMoreButton(
    index: number,
    nodeIdLength: number,
    selectionDirection: SelectionDirection
): boolean {
    return isNewestOnBottom()
        ? (index === 1 && selectionDirection === SelectionDirection.Next) ||
              (index === 0 && selectionDirection === SelectionDirection.Previous)
        : (index === nodeIdLength - 1 && selectionDirection === SelectionDirection.Next) ||
              (index === nodeIdLength - 2 && selectionDirection === SelectionDirection.Previous);
}
