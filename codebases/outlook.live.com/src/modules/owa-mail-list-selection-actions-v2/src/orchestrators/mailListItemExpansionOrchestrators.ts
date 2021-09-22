import setTableIsInCheckedMode from '../internal/mutators/setTableIsInCheckedMode';
import onListViewSelectionChange from '../internal/onListViewSelectionChange';
import type { ClientItemId } from 'owa-client-ids';
import type { ConversationFork } from 'owa-graph-schema';
import * as mailListSelectionActionsV2 from 'owa-mail-actions/lib/mailListSelectionActions';
import { isImmersiveReadingPaneShown } from 'owa-mail-layout/lib/selectors/isImmersiveReadingPaneShown';
import { isReadingPanePositionOff } from 'owa-mail-layout/lib/selectors/readingPanePosition';
import { listViewStore, MailRowDataPropertyGetter, TableView } from 'owa-mail-list-store';
import getForksInConversation from 'owa-mail-store-unstacked/lib/utils/getForksInConversation';
import { getMailboxInfo } from 'owa-mail-mailboxinfo';
import { ConversationItemParts, MailListItemSelectionSource, mailStore } from 'owa-mail-store';
import { lazyLoadConversation } from 'owa-mail-store-actions';
import { expandRowFirstLevel } from 'owa-mail-store-unstacked';
import getItemForMailList from 'owa-mail-store/lib/selectors/getItemForMailList';
import isConversationInMailStore from 'owa-mail-store/lib/utils/isConversationInMailStore';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { orchestrator } from 'satcheljs';
import {
    isSecondLevelExpanded,
    isFirstLevelExpanded,
} from 'owa-mail-list-store/lib/selectors/isConversationExpanded';
import {
    lazySetItemIdToScrollTo,
    lazyLoadItemReadingPaneForSingleMailItemSelected,
} from 'owa-mail-reading-pane-store';
import isHxForksEnabled from 'owa-mail-store-unstacked/lib/utils/isHxForksEnabled';

export const itemPartSelectedOrchestrator = orchestrator(
    mailListSelectionActionsV2.itemPartSelected,
    actionMessage => {
        selectItemPartInternal(
            actionMessage.itemId,
            actionMessage.tableView,
            actionMessage.nodeId,
            actionMessage.allNodeIds,
            actionMessage.mailListItemSelectionSource
        );
    }
);

// Orchestrator to select the first item part after a conversation has been expanded or clear the expansion state when collapsing
orchestrator(mailListSelectionActionsV2.onAfterSelectionChanged, actionMessage => {
    if (actionMessage.listViewType == ReactListViewType.Message) {
        return;
    }
    const expansionState = listViewStore.expandedConversationViewState;
    const isSourceTwisty =
        actionMessage.mailListItemSelectionSource == MailListItemSelectionSource.MailListItemTwisty;
    if (shouldShowUnstackedReadingPane() && expansionState.expandedRowKey != actionMessage.rowKey) {
        // first load, handle first level expansion here
        expandConversationFirstLevel(actionMessage.rowKey, actionMessage.tableView, isSourceTwisty);
    } else if (expansionState.expandedRowKey == actionMessage.rowKey) {
        if (expansionState.shouldBeExpanded) {
            // loading first level or second level
            if (!expansionState.forks) {
                // loading second level
                expandConversationSecondLevel(actionMessage.rowKey, actionMessage.tableView);
            } else {
                expandConversationFirstLevel(
                    actionMessage.rowKey,
                    actionMessage.tableView,
                    isSourceTwisty
                );
            }
        } else if (!expansionState.forks && isSourceTwisty) {
            collapseConversation();
        }
    }
});

// Orchestrator to collapse a conversation (if it is not already collapsed) when a user gives keyboard command
// Win32 allows for collapsing even with first level expanded, adding the check for parity.
orchestrator(mailListSelectionActionsV2.keyboardCollapseConversation, actionMessage => {
    if (isFirstLevelExpanded(actionMessage.rowKey) || isSecondLevelExpanded(actionMessage.rowKey)) {
        collapseConversation();
    }
});

// Orchestrator to select the next item part after an item part is deleted
orchestrator(mailListSelectionActionsV2.selectNextItemPart, actionMessage => {
    let nodeIdToSelect = null;
    let itemId = null;
    let allNodeIds = null;
    if (!isFirstLevelExpanded(actionMessage.rowKey)) {
        const conversationId = MailRowDataPropertyGetter.getConversationId(
            actionMessage.rowKey,
            actionMessage.tableView
        );
        const conversationItemParts: ConversationItemParts = mailStore.conversations.get(
            conversationId
        );
        const firstSelectedItemIndex = conversationItemParts.conversationNodeIds.indexOf(
            listViewStore.expandedConversationViewState.selectedNodeIds[0]
        );

        allNodeIds = conversationItemParts.conversationNodeIds;

        // Select the next visible node after actionMessage.nodeId
        for (
            let i = firstSelectedItemIndex + 1;
            i < conversationItemParts.conversationNodeIds.length;
            i++
        ) {
            const nodeId = conversationItemParts.conversationNodeIds[i];
            const item = getItemForMailList(nodeId, false);
            if (item) {
                itemId = item.ItemId.Id;
                nodeIdToSelect = nodeId;
                break;
            }
        }
    } else {
        const forks = listViewStore.expandedConversationViewState.forks;
        const forkItemIds = forks.map(fork => {
            return fork.id;
        });

        allNodeIds = forkItemIds;
        if (forks.length > 1) {
            const indexOfDeleted = forkItemIds.indexOf(
                listViewStore.expandedConversationViewState.selectedNodeIds[0]
            );
            if (indexOfDeleted != -1) {
                itemId =
                    forks.length - 1 > indexOfDeleted
                        ? forks[indexOfDeleted + 1]?.id
                        : forks[indexOfDeleted - 1]?.id;
                nodeIdToSelect = itemId;
            }
        }
    }

    // If there is a visible node after the action message's node, select it. Otherwise select the first node in the list
    if (nodeIdToSelect) {
        selectItemPartInternal(
            itemId,
            actionMessage.tableView,
            nodeIdToSelect,
            allNodeIds,
            MailListItemSelectionSource.RowRemoval
        );
    } else {
        selectInitialItemPart(actionMessage.rowKey, actionMessage.tableView);
    }
});

let propagateReadingPaneScroll: NodeJS.Timer;
let lastKeyboardSelectionTime: number = 0;
let isFirstSelection: boolean = true;

/**
 * Select item part by
 * showing RP (if required)
 * setting scroll to correct item in RP
 * setting the correct item id in the expanded view state so that UI shows the selection
 */
function selectItemPartInternal(
    itemId: string,
    tableView: TableView,
    nodeId: string,
    allNodeIds: string[],
    selectionSource: MailListItemSelectionSource
) {
    if (propagateReadingPaneScroll) {
        clearTimeout(propagateReadingPaneScroll);
        propagateReadingPaneScroll = null;
    }

    // Determine whether to show RP e.g. in SLV if user clicks on item part
    onListViewSelectionChange(tableView, true /* isUserNavigation */, selectionSource, undefined);

    // [Perf optimization] If user is moving through the item parts via keyboard up/down arrows, add a slight delay
    // to avoid us having to expand and scroll to every item (or make getItem calls in case of unstacked reading pane)
    // if user is just trying to scroll (each stroke is within a small window).
    if (
        selectionSource === MailListItemSelectionSource.KeyboardUpDown &&
        !isReadingPanePositionOff()
    ) {
        const currentKeyboardSelectionTime = Date.now();
        const selectionTimeDiff = currentKeyboardSelectionTime - lastKeyboardSelectionTime;
        lastKeyboardSelectionTime = currentKeyboardSelectionTime;
        if (
            isFirstSelection ||
            selectionTimeDiff <= 500 //milliseconds
        ) {
            isFirstSelection = false;
            propagateReadingPaneScroll = setTimeout(() => {
                propagateReadingPaneScroll = null;
                isFirstSelection = true;
                showItemPartOnReadingPane(itemId, tableView);
            }, 250);
        }
    } else {
        showItemPartOnReadingPane(itemId, tableView);
    }
    const expandedConversationViewState = listViewStore.expandedConversationViewState;
    // Set the expanded row key
    mailListSelectionActionsV2.singleSelectItemPart(
        expandedConversationViewState.expandedRowKey,
        nodeId,
        allNodeIds,
        tableView.id,
        expandedConversationViewState.selectedNodeIds
    );
}

function showItemPartOnReadingPane(itemId: string, tableView: TableView) {
    if (shouldShowUnstackedReadingPane()) {
        // If a new row has been focused while still loading a previous expansion, do not load the stale item into the RP
        if (
            tableView.focusedRowKey !== listViewStore.expandedConversationViewState.expandedRowKey
        ) {
            return;
        }
        // load item corresponding to itempart
        lazyLoadItemReadingPaneForSingleMailItemSelected.importAndExecute(
            { Id: itemId, mailboxInfo: getMailboxInfo(tableView) },
            true /*isUserNavigation*/,
            null /*instrumentationContext*/,
            false /*shouldLoadCompose*/
        );
    } else {
        // scroll to selected itempart
        const selectedRowKeyId = MailRowDataPropertyGetter.getRowClientItemId(
            listViewStore.expandedConversationViewState.expandedRowKey,
            tableView
        );
        lazySetItemIdToScrollTo.importAndExecute(
            selectedRowKeyId?.Id,
            itemId,
            true /* shouldNotGrabFocus */
        );
    }
}

// Select the first item part
function selectInitialItemPart(
    rowKey: string,
    tableView: TableView,
    forks?: ConversationFork[],
    shouldSelectLatestLocalItem?: boolean
) {
    let nodeIds: string[] = forks?.map(fork => fork.id);
    if (!nodeIds || nodeIds.length == 0) {
        const conversationId = MailRowDataPropertyGetter.getConversationId(rowKey, tableView);
        const conversationItemParts: ConversationItemParts = mailStore.conversations.get(
            conversationId
        );
        nodeIds = conversationItemParts?.conversationNodeIds;
    }

    const itemIdToShowInReadingPane = shouldSelectLatestLocalItem
        ? MailRowDataPropertyGetter.getRowIdToShowInReadingPane(rowKey, tableView)
        : null;

    // Select the first visible node since some can be hidden (e.g. if the user hides deleted items in conversations)
    if (nodeIds) {
        for (const nodeId of nodeIds) {
            const item = getItemForMailList(nodeId, isFirstLevelExpanded(rowKey));
            if (
                item &&
                (!itemIdToShowInReadingPane || item.ItemId.Id == itemIdToShowInReadingPane.Id)
            ) {
                // When unstacked conversation is enabled along with SLV, we do not want to do a row removal
                // of the first item in list view as it causes reading pane off and list view on,
                // we don't want to go back to the list view.
                selectItemPartInternal(
                    item.ItemId.Id,
                    tableView,
                    nodeId,
                    nodeIds,
                    shouldShowUnstackedReadingPane() &&
                        isImmersiveReadingPaneShown() &&
                        isReadingPanePositionOff()
                        ? MailListItemSelectionSource.MailListItemExpansion
                        : MailListItemSelectionSource.RowRemoval
                );
                break;
            }
        }
    }
}

async function expandConversationSecondLevel(rowKey: string, tableView: TableView) {
    const conversationId: ClientItemId = MailRowDataPropertyGetter.getRowClientItemId(
        rowKey,
        tableView
    );
    if (conversationId && !isConversationInMailStore(conversationId.Id)) {
        await lazyLoadConversation.importAndExecute(conversationId, 'PrefetchSingleRow');
    }
    // set loading state to false and latestItemIdsInEachFork to null
    mailListSelectionActionsV2.setSecondLevelListViewExpansion(rowKey);

    setTableIsInCheckedMode(tableView, false);

    if (shouldShowUnstackedReadingPane()) {
        // We show latest local item/ fork in first level expansion. Therefore, when second level expands,
        // the corresponding local itempart should be selected so as not to change the reading pane.
        selectInitialItemPart(rowKey, tableView, null, true /*shouldSelectLatestLocalItem*/);
    } else {
        // Select first item part
        selectInitialItemPart(rowKey, tableView);
    }
}

function collapseConversation() {
    mailListSelectionActionsV2.resetListViewExpansionViewState();
}

async function expandConversationFirstLevel(
    rowKey: string,
    tableView: TableView,
    isSourceTwisty: boolean
) {
    const conversationId: ClientItemId = MailRowDataPropertyGetter.getRowClientItemId(
        rowKey,
        tableView
    );
    if (conversationId) {
        const conversationIdString = conversationId.Id;
        if (!isHxForksEnabled() && !isConversationInMailStore(conversationIdString)) {
            await lazyLoadConversation.importAndExecute(
                conversationId,
                'CreateConversationRelationMap'
            );
        }

        const parentFolderId: string = MailRowDataPropertyGetter.getParentFolderId(
            rowKey,
            tableView
        );
        if (parentFolderId) {
            const forks = await getForksInConversation(
                conversationIdString,
                parentFolderId,
                conversationId.mailboxInfo
            );

            // First level expansion is required only if there are multiple forks.
            if (forks.length > 1) {
                expandRowFirstLevel(rowKey, forks);
                // Select first item part
                selectInitialItemPart(rowKey, tableView, forks);
            } else {
                // We do not have multiple forks. If twisty clicked, expand second level else just set isLoading to false to denote first level expansion is complete.
                if (isSourceTwisty) {
                    expandConversationSecondLevel(rowKey, tableView);
                } else {
                    expandRowFirstLevel(rowKey, forks);
                }
            }
        }
    }
}
