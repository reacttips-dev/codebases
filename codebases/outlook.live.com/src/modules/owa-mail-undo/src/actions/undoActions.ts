import undoStore, { getUndoStore, UndoStore } from '../store/undoStore';
import tombstoneOperations from 'owa-mail-list-tombstone';
import type { ActionSource } from 'owa-mail-store';
import type ApplyMessageActionResponseMessage from 'owa-service/lib/contract/ApplyMessageActionResponseMessage';
import type MoveItemResponse from 'owa-service/lib/contract/MoveItemResponse';
import { mutatorAction } from 'satcheljs';
import { PerformanceDatapoint } from 'owa-analytics';
import type * as Schema from 'owa-graph-schema';
import { getApolloClient } from 'owa-apollo';
import {
    DismissUndoDocument,
    DismissUndoMutationVariables,
} from '../graphql/__generated__/dismissUndoMutation.interface';
import { isNotificationChannelInitialized } from 'owa-mail-notification-channel-ready/lib/isNotificationChannelInitialized';
import undoWhenNotificationChannelNotReady from 'owa-mail-actions/lib/table-loading/undoWhenNotificationChannelNotReady';

export interface UndoStoreState {
    store: UndoStore;
}

declare type UndoResponseType = ApplyMessageActionResponseMessage | MoveItemResponse | void;

/**
 * Only supporting a "stack" of one (last undo action)
 */
let lastUndoAction: (() => Promise<UndoResponseType>) | null;
let lastUndoableActionPromise: Promise<Schema.UndoableActionResult> | null;

const setUndoableAction = mutatorAction(
    'setUndoableAction',
    (hasUndoableAction: boolean, actionFolderId: string | null) => {
        const store = getUndoStore();
        store.hasUndoableAction = hasUndoableAction;
        store.undoableActionFolderId = actionFolderId;
    }
);

export function addActionToUndoStack(
    undoAction: (() => Promise<UndoResponseType>) | null,
    actionFolderId: string,
    undoableActionPromise?: Promise<Schema.UndoableActionResult>
) {
    if (undoAction !== null) {
        lastUndoAction = undoAction;
        lastUndoableActionPromise = undoableActionPromise || null;
        setUndoableAction(true, actionFolderId);
    }
}

/**
 * Gets last undo action
 * @return Last undo action
 */
export function getLastUndoAction(): (() => Promise<UndoResponseType>) | null {
    return lastUndoAction;
}

/**
 * Gets last undoable action promise
 * @return Last undoable action promise
 */
export function getLastUndoableActionPromise(): Promise<Schema.UndoableActionResult> | null {
    return lastUndoableActionPromise;
}

/**
 * Clears last undoable action (to null)
 */
export async function clearLastUndoableAction(): Promise<void> {
    await dismissLastUndoRequest();
    lastUndoAction = null;
    setUndoableAction(false, null);
}

export async function dismissLastUndoRequest() {
    // If there is a undo requestId available, then invoke dismissUndo action with it to make sure this Undo action cannot be taken henceforth.
    if (lastUndoableActionPromise) {
        try {
            const response: Schema.UndoableActionResult = await lastUndoableActionPromise;
            if (response.success) {
                const undoRequestId = response.undoRequestId;
                if (undoRequestId) {
                    let input: DismissUndoMutationVariables = {
                        undoRequestId: undoRequestId,
                    };
                    await exportedHelperFunctions.invokeDismissUndoMutation(input);
                }
            }
        } catch (e) {
            // catch here if lastUndoableActionPromise was rejected as awaiting on a rejected promise
            // throws errors. The promise will be rejected in case the action had failed and catching helps
            // continue the execution of current triage action normally
        }
        lastUndoableActionPromise = null;
    }
}

/**
 * Invoke the dismiss Undo mutation
 * @param input input parameters for the mutation
 */
const invokeDismissUndoMutationFn = async function invokeDismissUndoMutation(
    input: DismissUndoMutationVariables
) {
    const client = getApolloClient();
    if (client) {
        await client.mutate({
            variables: input,
            mutation: DismissUndoDocument,
        });
    }
};

/**
 * This helper method is exported so it can be mocked for unit testing
 */
export const exportedHelperFunctions = {
    invokeDismissUndoMutation: invokeDismissUndoMutationFn,
};

/**
 * Returns if last undoable action is empty
 * @return If last undoable action is empty
 */
export function hasUndoableAction(): boolean {
    return getUndoStore().hasUndoableAction;
}

/**
 * Undos the last undoable action (if it exists).
 */
export function undo(actionSource: ActionSource): Promise<void> {
    const dp = new PerformanceDatapoint('TnS_Undo');
    dp.addCustomData([actionSource]);
    // Need to remove everything for the folder where the undo action is being taken from tombstone because if the action is being performed on a row that is
    // in tombstone then we will not honor the row notification when the action gets undone so row won't come back.
    if (undoStore.undoableActionFolderId) {
        tombstoneOperations.clearMapForFolder(undoStore.undoableActionFolderId);
    } else {
        // There are cases when we do not have folder id e.g deleteItems which can be performed from various places like RP, fileshub etc.
        // Once (VSO: 45716 - [Refactor] Remove usage of geSelectedTableView from delete item) is fixed we shall pass correct folder id to clear
        tombstoneOperations.removeAll();
    }

    const lastUndoAction = getLastUndoAction();

    // lastUndoAction can be null if lazy loading of undo doesn't finish before user performs another action
    // that clears the undo stack.
    if (lastUndoAction !== null) {
        // Perform undo
        lastUndoAction().then(() => {
            if (!isNotificationChannelInitialized()) {
                undoWhenNotificationChannelNotReady();
            }
        });

        // Must clear stack so user can't try to undo same action again. Also clears UI.
        clearLastUndoableAction();
    }
    dp.end();

    return Promise.resolve();
}

/**
 * This is just exported for test purposes and should not be invoked in product code
 */
export function test_reset() {
    lastUndoAction = null;
    lastUndoableActionPromise = null;
}
