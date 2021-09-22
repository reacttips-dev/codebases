import createBusStopStateMapInternal from '../internal/createBusStopStateMapInternal';
import { ObservableMap } from 'mobx';
import focusItemPart from 'owa-mail-actions/lib/focusItemPart';
import * as mailListSelectionActionsV2 from 'owa-mail-actions/lib/mailListSelectionActions';
import { setSelectionOnRow } from 'owa-mail-actions/lib/setSelectionOnRow';
import { BusStopState, listViewStore } from 'owa-mail-list-store';
import resetExpansionViewStateInternal from 'owa-mail-list-store/lib/utils/resetExpansionViewStateInternal';
import updateLoadedConversationReadingPaneAction from 'owa-mail-reading-pane-store/lib/actions/updateLoadedConversationReadingPaneAction';
import { ConversationItemParts, MailListItemSelectionSource, mailStore } from 'owa-mail-store';
import { mutator } from 'satcheljs';
import { isFirstLevelExpanded } from 'owa-mail-list-store/lib/selectors/isConversationExpanded';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';

// Updates expanded conversation view state's store value when an item part is selected/deselected
mutator(mailListSelectionActionsV2.toggleSelectItemPart, actionMessage => {
    const { nodeId } = actionMessage;
    const { selectedNodeIds, allNodeIds } = listViewStore.expandedConversationViewState;

    listViewStore.expandedConversationViewState.focusedNodeId = nodeId;
    if (selectedNodeIds.indexOf(nodeId) > -1) {
        selectedNodeIds.splice(selectedNodeIds.indexOf(nodeId), 1);
    } else {
        selectedNodeIds.push(nodeId);
    }
    if (selectedNodeIds.length === 1) {
        listViewStore.expandedConversationViewState.busStopStateMap = createBusStopStateMapInternal(
            selectedNodeIds[0],
            allNodeIds
        );
    }
});

mutator(mailListSelectionActionsV2.resetBusStopStateMap, actionMessage => {
    listViewStore.expandedConversationViewState.busStopStateMap = new ObservableMap<
        string,
        BusStopState
    >({});
});

mutator(focusItemPart, actionMessage => {
    listViewStore.expandedConversationViewState.focusedNodeId = actionMessage.nodeId;
});

mutator(mailListSelectionActionsV2.singleSelectItemPart, actionMessage => {
    const { rowKey, nodeIdToSelect, allNodeIds } = actionMessage;
    const expansionState = listViewStore.expandedConversationViewState;

    expansionState.selectedNodeIds = [nodeIdToSelect];
    expansionState.busStopStateMap = createBusStopStateMapInternal(nodeIdToSelect, allNodeIds);
    expansionState.expandedRowKey = rowKey;
    expansionState.focusedNodeId = nodeIdToSelect;
    expansionState.allNodeIds = allNodeIds;
});

mutator(mailListSelectionActionsV2.toggleSelectRow, actionMessage => {
    // If user clicks a checkbox collapse the current expansion
    if (
        actionMessage.mailListItemSelectionSource ===
        MailListItemSelectionSource.MailListItemCheckbox
    ) {
        resetExpansionViewStateInternal();
    }
});

// Runs after a selection has changed on a regular mail list item
mutator(setSelectionOnRow, actionMessage => {
    resetExpansionViewStateInternal();
});

mutator(mailListSelectionActionsV2.resetListViewExpansionViewState, actionMessage => {
    resetExpansionViewStateInternal();
});

mutator(mailListSelectionActionsV2.resetSelectionOnTable, actionMessage => {
    resetExpansionViewStateInternal();
});

mutator(mailListSelectionActionsV2.singleSelectRow, actionMessage => {
    const { rowKey, mailListItemSelectionSource } = actionMessage;
    setExpansionStoreState(rowKey, mailListItemSelectionSource);
});

mutator(mailListSelectionActionsV2.setExpansionForRow, actionMessage => {
    const { rowKey, mailListItemSelectionSource } = actionMessage;
    setExpansionStoreState(rowKey, mailListItemSelectionSource);
});

mutator(mailListSelectionActionsV2.setSecondLevelListViewExpansion, actionMessage => {
    resetExpansionViewStateInternal();
    listViewStore.expandedConversationViewState.expandedRowKey = actionMessage.rowKey;
});

mutator(updateLoadedConversationReadingPaneAction, actionMessage => {
    if (listViewStore.expandedConversationViewState.selectedNodeIds.length === 1) {
        const selectedNodeId = listViewStore.expandedConversationViewState.selectedNodeIds[0];
        const conversationItemParts: ConversationItemParts = mailStore.conversations.get(
            actionMessage.conversationId
        );
        const allNodeIds = conversationItemParts.conversationNodeIds;
        listViewStore.expandedConversationViewState.busStopStateMap = createBusStopStateMapInternal(
            selectedNodeId,
            allNodeIds
        );
    }
});

function setExpansionStoreState(
    rowKey: string,
    mailListItemSelectionSource: MailListItemSelectionSource
) {
    const expansionState = listViewStore.expandedConversationViewState;
    if (expansionState.expandedRowKey != rowKey) {
        // Collapsed state
        if (shouldShowUnstackedReadingPane()) {
            // Set to loading 1st level
            expansionState.shouldBeExpanded = true;
            expansionState.expandedRowKey = rowKey;
            expansionState.forks = [];
        } else if (mailListItemSelectionSource === MailListItemSelectionSource.MailListItemTwisty) {
            // set to loading second level
            expansionState.shouldBeExpanded = true;
            expansionState.expandedRowKey = rowKey;
            expansionState.forks = null;
        }
    } else {
        // set loading second level if currently first level is expanded and twisty is clicked.
        if (
            mailListItemSelectionSource === MailListItemSelectionSource.MailListItemTwisty &&
            isFirstLevelExpanded(rowKey)
        ) {
            resetExpansionViewStateInternal();
            expansionState.shouldBeExpanded = true;
            expansionState.expandedRowKey = rowKey;
        }
    }
}
