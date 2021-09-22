import { updateNudge } from '../services/updateNudgesOperation';
import type { NudgeAction } from '../types/UpdateNudgesRequest';
import updatePreviouslyNudgedRowToOriginalPosition from '../utils/updatePreviouslyNudgedRowToOriginalPosition';
import { logUsage } from 'owa-analytics';
import { createLazyOrchestrator } from 'owa-bundling';
import deleteItemsStoreUpdate from 'owa-mail-actions/lib/triage/deleteItemsStoreUpdate';
import markConversationsAsPinnedStoreUpdate from 'owa-mail-actions/lib/triage/markConversationsAsPinnedStoreUpdate';
import markItemsAsPinnedStoreUpdate from 'owa-mail-actions/lib/triage/markItemsAsPinnedStoreUpdate';
import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';
import onSendMessageSucceeded from 'owa-mail-compose-actions/lib/actions/onSendMessageSucceeded';
import { ComposeOperation } from 'owa-mail-compose-store';
import { getSelectedTableView } from 'owa-mail-list-store';
import { dismissNudge } from 'owa-mail-triage-action/lib/actions/actionCreators/dismissNudge';
import {
    onNudgeInfoBarClicked,
    NudgeInfoBarResponse,
} from 'owa-mail-shared-actions/lib/onNudgeInfoBarClicked';
import {
    getNudgedRowKeyFromItemId,
    getNudgedRowKeyFromConversationId,
    getStore,
    isNudgedRow,
    onNudgeRemoved,
    NudgedReason,
} from 'owa-mail-nudge-store';
import { trace } from 'owa-trace';
import { logNudgeRemoved } from '../utils/logNudgeRemoved';
import type { ActionType } from 'owa-mail-actions/lib/triage/userMailInteractionAction';
import { onNudgeIsEnableSaved } from 'owa-mail-shared-actions/lib/onNudgeIsEnableSaved';
import {
    getIsBitSet,
    FocusedInboxBitFlagsMasks,
} from 'owa-bit-flags/lib/utils/focusedInboxBitFlagConstants';
import rowUpdatedUponNotification from 'owa-mail-actions/lib/triage/rowUpdatedUponNotification';
import { validateExistingRowAsNudge } from './helpers/validateExistingRowAsNudge';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';

let lastNudgeItemIdRemovedDueToRowUpdate;
let lastNudgeRowKeyRemovedDueToRowUpdate;

/**
 * For updateNudge api request pass entryId no matter what the state
 * of fwk-immutableid flight is.
 */
function getItemIdToUse(itemId: string, rowKey: string) {
    let itemIdToUse = itemId;
    const nudgedRows = getStore().nudgedRows.filter(
        nudgedRow => nudgedRow.rowKey === rowKey && nudgedRow.itemId === itemId
    );

    if (nudgedRows.length > 0) {
        itemIdToUse = nudgedRows[0].entryId;
    }

    return itemIdToUse;
}

// Action performed from reading pane nudge info bar [MarkComplete/Dismiss]
export const removeNudgeOnInfoBarClickedOrchestrator = createLazyOrchestrator(
    onNudgeInfoBarClicked,
    'clone_onNudgeInfoBarClicked',
    actionMessage => {
        const updateNudgeAction =
            actionMessage.response === NudgeInfoBarResponse.MarkComplete
                ? 'MarkedComplete'
                : 'DismissedOnView';

        const itemIdToUse = getItemIdToUse(actionMessage.itemId, actionMessage.rowKey);

        updateNudgeOnNudgeAction(
            actionMessage.rowKey,
            itemIdToUse,
            updateNudgeAction,
            'ReadingPane'
        );
    }
);

// Dismissed from list view
export const removeNudgeOnDismissNudgeClickedOrchestrator = createLazyOrchestrator(
    dismissNudge,
    'clone_onDismissNudgeClicked',
    actionMessage => {
        const nudgedRows = getStore().nudgedRows.filter(
            nudgedRow =>
                nudgedRow.rowKey === actionMessage.rowKey &&
                nudgedRow.tableViewId === actionMessage.tableViewId
        );

        // in conversation view, each rowKey may map to multiple itemIds
        nudgedRows.forEach(nudgedRow => {
            updateNudgeOnNudgeAction(
                actionMessage.rowKey,
                nudgedRow.entryId,
                'Dismissed',
                actionMessage.actionSource
            );
        });
    }
);

export const removeNudgeOnItemsPinnedStoreUpdateOrchestrator = createLazyOrchestrator(
    markItemsAsPinnedStoreUpdate,
    'clone_markItemsAsPinnedStoreUpdate',
    actionMessage => {
        updateNudgesOnPinUnpin(
            actionMessage.rowKeys,
            actionMessage.tableViewId,
            actionMessage.shouldMarkAsPinned
        );
    }
);

export const removeNudgeOnConversationsPinnedStoreUpdateOrchestrator = createLazyOrchestrator(
    markConversationsAsPinnedStoreUpdate,
    'clone_markConversationsAsPinnedStoreUpdate',
    actionMessage => {
        updateNudgesOnPinUnpin(
            actionMessage.rowKeys,
            actionMessage.tableViewId,
            actionMessage.shouldMarkAsPinned
        );
    }
);

/*
 * This handles dismissing nudge on the following item level action performed from RP
 * move, delete, archive, schedule, junk etc that remove the item from list view
 */
export const removeNudgeOnItemDeleteStoreUpdateOrchestrator = createLazyOrchestrator(
    deleteItemsStoreUpdate,
    'clone_deleteItemsStoreUpdate',
    actionMessage => {
        const itemIds = actionMessage.itemContexts.map(itemContext => itemContext.itemId);
        itemIds.forEach(itemId => {
            const rowKey = getNudgedRowKeyFromItemId(itemId);
            if (rowKey) {
                onNudgeRemoved(rowKey);
                logNudgeRemoved(rowKey, actionMessage.actionType, getNudgeReasonType(rowKey));
            }
        });
    }
);

/*
 * This handles removing nudge on the following conversation actions
 * move, delete, archive, schedule, junk, ignore as well as row notification that remove
 * the conversation row from list view
 */
export const removeNudgeOnRowsDeleteStoreUpdateOrchestrator = createLazyOrchestrator(
    removeRowsFromListViewStore,
    'clone_removeRowsFromListViewStore',
    actionMessage => {
        removeNudgedRows(
            actionMessage.rowKeys,
            actionMessage.tableView.id,
            actionMessage.actionType
        );
    }
);

export const removeNudgeOnReplyOrReplyAllOrForwardOrchestrator = createLazyOrchestrator(
    onSendMessageSucceeded,
    'clone_onSendMessageSucceeded',
    actionMessage => {
        const operation = actionMessage.operation;
        if (
            operation !== ComposeOperation.Reply &&
            operation !== ComposeOperation.ReplyAll &&
            operation !== ComposeOperation.Forward
        ) {
            return;
        }

        if (!actionMessage.referenceItemId) {
            trace.warn('Nudge: referenceItemId should not be null for r/R/f operations');
        }

        const referenceItemId = actionMessage.referenceItemId.Id;
        const conversationId = actionMessage.conversationId;

        let rowKey = getNudgedRowKeyFromItemId(referenceItemId);

        /**
         * If the item to which user was r/R/F ing is not the nudge item but its part
         * of the conversation to which the nudge item belongs, the conversation would be nudged
         * and we will get the rowKey using conversationId comparison
         */
        if (!rowKey) {
            rowKey = getNudgedRowKeyFromConversationId(conversationId);
        }

        let reason;
        if (rowKey) {
            // Found a rowKey in the nudge store
            updatePreviouslyNudgedRowToOriginalPosition(rowKey, getSelectedTableView());
            reason = getNudgeReasonType(rowKey);
            onNudgeRemoved(rowKey);
        } else if (lastNudgeItemIdRemovedDueToRowUpdate == referenceItemId) {
            rowKey = lastNudgeRowKeyRemovedDueToRowUpdate;
        }

        if (rowKey) {
            logUsage(
                'Nudge_Reply',
                {
                    owa_1: operation,
                    owa_2: reason,
                    refId: referenceItemId,
                    cId: conversationId,
                    rKey: rowKey, // The nudge row could be removed from the nudge store before this orchestrator was called.
                    // This can happen as we are also removing the nudge upon notifications.
                },
                { isCore: true }
            );
        }
    }
);

export const removeNudgeUponRowUpdate = createLazyOrchestrator(
    rowUpdatedUponNotification,
    'clone_removeNudgeUponRowUpdate',
    actionMessage => {
        const nudgeRow = getStore().nudgedRows.filter(
            nudgedRow => nudgedRow.rowKey === actionMessage.rowKey
        );
        if (nudgeRow.length > 0) {
            // Un-nudge if the row is not a valid nudge any more
            const discardReason = validateExistingRowAsNudge(
                nudgeRow[0].itemId,
                nudgeRow[0].conversationId,
                null /* corelationId */,
                actionMessage.tableView,
                folderIdToName(actionMessage.tableView.tableQuery.folderId) == 'inbox',
                actionMessage.rowKey,
                'RowRemove',
                false, // shouldLogDatapoint
                nudgeRow[0].nudgeItemTime,
                nudgeRow[0].reason
            );
            if (discardReason) {
                lastNudgeItemIdRemovedDueToRowUpdate = nudgeRow[0].itemId;
                lastNudgeRowKeyRemovedDueToRowUpdate = actionMessage.rowKey;

                updatePreviouslyNudgedRowToOriginalPosition(
                    actionMessage.rowKey,
                    actionMessage.tableView
                );
                removeNudgedRows([actionMessage.rowKey], actionMessage.tableView.id, discardReason);
            }
        }
    }
);

/**
 * When the show nudge option changes we should remove the nudges
 * from the list if there were any and nudge was disabled
 */
export const updateNudgesOnNudgeOptionChange = createLazyOrchestrator(
    onNudgeIsEnableSaved,
    'updateNudgesOnNudgeOptionChangeClone',
    actionMessage => {
        // Remove nudges and update their positions if nudge is disabled
        if (getIsBitSet(FocusedInboxBitFlagsMasks.IsNudgeDisabled)) {
            const nudgeRowKeys = getStore().nudgedRows.map(nudgeRow => nudgeRow.rowKey);
            const tableView = getSelectedTableView();
            nudgeRowKeys.forEach(rowKey => {
                updatePreviouslyNudgedRowToOriginalPosition(rowKey, tableView);
                removeNudgedRows([rowKey], tableView.id, 'NudgeDisabled');
            });
        }
    }
);

function updateNudgesOnPinUnpin(rowKeys: string[], tableViewId: string, isMarkAsPinned: boolean) {
    const updateNudgeAction = isMarkAsPinned ? 'Pinned' : 'Unpinned';
    rowKeys.forEach(rowKey => {
        const nudgedRows = getStore().nudgedRows.filter(
            nudgedRow => nudgedRow.rowKey === rowKey && nudgedRow.tableViewId === tableViewId
        );

        nudgedRows.forEach(nudgedRow => {
            updateNudge(nudgedRow.entryId, updateNudgeAction, 'PinUnpin', nudgedRow.reason);
        });
    });

    // Nudge row shall be removed from the store when pinned/unpinned
    removeNudgedRows(rowKeys, tableViewId, 'PinUnpin');
}

/**
 * Makes update nudge call on nudge actions such as Dismissed and Mark Complete
 * @param rowKey rowKey for which to perform update nudge
 * @param itemId item id
 * @param nudgeAction the nudge action
 * @param actionSource source from where the nudge action is performed
 */
function updateNudgeOnNudgeAction(
    rowKey: string,
    itemId: string,
    nudgeAction: NudgeAction,
    actionSource: string
) {
    const reason = getNudgeReasonType(rowKey);
    updateNudge(itemId, nudgeAction, actionSource, reason);
    updatePreviouslyNudgedRowToOriginalPosition(rowKey, getSelectedTableView());
    onNudgeRemoved(rowKey);
}

/**
 * Try to remove the nudge rows from the nudge store
 * @param rowKeys rowKeys for rows that were removed
 * @param tableViewId tableId for the table where the rows where removed
 * @param actionType type of action that lead to the removal
 */
function removeNudgedRows(rowKeys: string[], tableViewId: string, actionType: ActionType | string) {
    rowKeys.forEach(rowKey => {
        if (isNudgedRow(rowKey, tableViewId)) {
            const nudgeReason = getNudgeReasonType(rowKey);
            onNudgeRemoved(rowKey);
            logNudgeRemoved(rowKey, actionType, nudgeReason);
        }
    });
}

function getNudgeReasonType(rowKey: string): NudgedReason {
    const nudgeRow = getStore().nudgedRows.filter(nudgedRow => nudgedRow.rowKey === rowKey);
    return nudgeRow.length > 0 ? nudgeRow[0].reason : null;
}
