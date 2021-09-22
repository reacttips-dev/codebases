import getNudgedRowData from '../services/getNudgedRowData';
import { getNudges, GetNudgesResponseWithError } from '../services/getNudgesOperation';
import type { Nudge } from '../types/GetNudgesResponse';
import getClientNudgesIfTesting from '../utils/getClientNudgesIfTesting';
import getNudgedReasonFromResponse from '../utils/getNudgedReasonFromResponse';
import isNudgeSupportedInFolder, {
    isNudgeEnabled,
} from 'owa-mail-nudge-store/lib/utils/isNudgeSupported';
import updatePreviouslyNudgedRowToOriginalPosition from '../utils/updatePreviouslyNudgedRowToOriginalPosition';
import { logUsage } from 'owa-analytics';
import { createLazyOrchestrator } from 'owa-bundling';
import { getGuid } from 'owa-guid';
import { onSelectFolderComplete } from 'owa-mail-shared-actions/lib/onSelectFolderComplete';
import { getFirstUnpinnedRowIndex } from 'owa-mail-list-response-processor';
import TableOperations from 'owa-mail-list-table-operations';
import { getMailboxInfoFromTableQuery } from 'owa-mail-mailboxinfo';
import {
    getStore,
    NudgedRow,
    onGetNudgesCompleted,
    NudgedReason,
    onNudgeRemoved,
} from 'owa-mail-nudge-store';
import { lazyLoadConversation, lazyLoadItem } from 'owa-mail-store-actions';
import { getStore as getMailStore } from 'owa-mail-store/lib/store/Store';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { trace } from 'owa-trace';
import {
    getSelectedTableView,
    getRowKeysFromRowIds,
    TableView,
    TableQuery,
    MailRowDataPropertyGetter,
    isConversationView,
} from 'owa-mail-list-store';
import { differenceInCalendarDays, userDate } from 'owa-datetime';
import { getTestNudgeRowDataForRowNotLoadedInTableView } from './helpers/getTestNudgeRows';
import { getQueryStringParameter } from 'owa-querystring';
import { logNudgeRemoved } from '../utils/logNudgeRemoved';
import { onNudgeIsEnableSaved } from 'owa-mail-shared-actions/lib/onNudgeIsEnableSaved';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { validateServerRowAsNudge } from './helpers/validateServerRowAsNudge';
import { validateExistingRowAsNudge } from './helpers/validateExistingRowAsNudge';
import { scrubForPii } from 'owa-config';

// This variable is used to ensure that
// only one GetNudge call is issued at a time
let isLoadingNudge: boolean = false;
let addedListenerToVisibilityChangeEvent;
let getNudgesTaskHandle;
let lastSuccessfulGetNudgesCallTimeMap = {};
const GET_NUDGES_INTERVAL = 60 * 60 * 1000; // every 1 hour
const MIN_TIME_DIFF_BETWEEN_CALLS = 30 * 60 * 1000; // 30 mins
const MIN_AFTER_NUDGE_REMOVAL = 15 * 60 * 1000; // 15 mins

/**
 * Try get nudges when user changes the show nudge option in settings
 */
export const getNudgesOnNudgeOptionChange = createLazyOrchestrator(
    onNudgeIsEnableSaved,
    'getNudgesOnNudgeOptionChangeClone',
    actionMessage => {
        tryGetNudges(true /* forceGet */, 'SettingChange');
    }
);

/**
 * Try get nudges on select folder
 */
export const getNudgesOnSelectFolderComplete = createLazyOrchestrator(
    onSelectFolderComplete,
    'clone_onSelectFolderComplete',
    actionMessage => {
        const { selectedFolderId, previousFolderId, isExitingSearch } = actionMessage;

        // Do not issue getNudges call if the switch folder has happened to the same folder node or
        // user is exiting search that ends up selecting previous folder node
        if (selectedFolderId == previousFolderId || isExitingSearch) {
            return;
        }

        tryGetNudges(false /* forceGet */, 'FolderSwitch');
    }
);

/**
 * Try get nudges when the nudge is removed
 */
export const getNudgesOnNudgeRemoved = createLazyOrchestrator(
    onNudgeRemoved,
    'clone_getNudgesOnNudgeRemoved',
    actionMessage => {
        /**
         * The reason we don't want to issue getNudge immediately after user removes the nudge
         * is to account for the delay we may face at the nudge service side to remove it from the nudge collection.
         * If we issue call immediately, user may see the same nudge again.
         */
        if (isFeatureEnabled('tri-nudgePolling')) {
            getNudgesTaskHandle = setTimeout(
                () => tryGetNudges(true /* forceGet */, 'NudgeRemoval'),
                MIN_AFTER_NUDGE_REMOVAL
            );
        }
    }
);

/**
 * Try getting nudges if the window is visible
 */
function getNudgesIfDocumentVisible(forceGet: boolean, source: string) {
    // This is the best effort to try to keep the nudges uptodate.
    // when the browser window becomes active.
    if (document.visibilityState === 'visible') {
        tryGetNudges(forceGet, source);
    }
}

/**
 * This function decides whether to make the getNudges call depending on when the last call was made,
 * which folder is selected etc. Also sets the next interval when the GetNudges call should be made.
 */
function tryGetNudges(forceGet: boolean, source: string) {
    // Return if we are already loading or if nudges is not enabled.
    if (isLoadingNudge || !isNudgeEnabled()) {
        return;
    }

    const isClientRefreshEnabled = isFeatureEnabled('tri-nudgePolling');

    if (!addedListenerToVisibilityChangeEvent && isClientRefreshEnabled) {
        addedListenerToVisibilityChangeEvent = true;
        document.addEventListener('visibilitychange', () =>
            getNudgesIfDocumentVisible(false, 'VisibilityChange')
        );
    }

    const tableView = getSelectedTableView();
    const selectedFolderId = tableView.tableQuery.folderId;

    if (!isNudgeSupportedInFolder(selectedFolderId)) {
        return;
    }

    // Don't make the next getNudges call if its within 30 minutes
    // Some scenarios will want to getNudges regardless of when the last call was made.
    if (isClientRefreshEnabled) {
        if (
            !forceGet &&
            Date.now() - lastSuccessfulGetNudgesCallTimeMap[selectedFolderId] <=
                MIN_TIME_DIFF_BETWEEN_CALLS
        ) {
            return;
        }

        // Cancel any pending getNudges task if getting the nudges now
        if (getNudgesTaskHandle) {
            clearTimeout(getNudgesTaskHandle);
            getNudgesTaskHandle = null;
        }

        // Set the new task to make getNudges call after an interval
        getNudgesTaskHandle = setTimeout(
            () => getNudgesIfDocumentVisible(false, 'Timer'),
            GET_NUDGES_INTERVAL
        );
    }

    // Make call to get nudges
    getNudgesInternal(selectedFolderId, tableView, source);

    lastSuccessfulGetNudgesCallTimeMap[selectedFolderId] = Date.now();
}

async function getNudgesInternal(selectedFolderId: string, tableView: TableView, source: string) {
    isLoadingNudge = true;
    const correlationId = getGuid();
    const startNudgeTime = Date.now();
    const getNudgesResult = await getNudges(correlationId);
    const newNudges: NudgedRow[] = [];
    const getNudgesResponseWithError = getNudgesResult as GetNudgesResponseWithError;
    const getNudgeLatency = Date.now() - startNudgeTime;

    // If we received server response correctly process the nudges
    if (getNudgesResponseWithError?.getNudgesResponse?.Nudges) {
        const nudgesFromServer = getNudgesResponseWithError.getNudgesResponse.Nudges;
        let totalNudgesForCurrentTable = 0;
        const itemIdsToLog = [];
        const validItemIdsToLog = [];
        const sentItemsFolderId = folderIdToName(selectedFolderId) == 'sentitems';
        for (let i = 0; i < nudgesFromServer.length; i++) {
            const nudge = nudgesFromServer[i];
            const nudgeFolderId = nudge.FolderId.Id;
            const nudgeItemId = getNudgeItemId(nudge);
            itemIdsToLog.push(nudgeItemId);

            // For Sent Items folder only show nudges that belong to sentItems
            // For Inbox try to show all nudges. e.g. a follow up nudge item could belong to a conversation that is in Inbox
            if (sentItemsFolderId && nudgeFolderId != selectedFolderId) {
                continue;
            }

            const nudgedRow = await processNudgeResponse(
                nudge,
                tableView,
                correlationId,
                !sentItemsFolderId,
                source
            );
            if (nudgedRow) {
                newNudges.push(nudgedRow);
                validItemIdsToLog.push(nudgeItemId);
            }

            totalNudgesForCurrentTable++;
        }

        logGetNudgeDatapoint(
            nudgesFromServer.length,
            totalNudgesForCurrentTable,
            newNudges.length,
            source,
            correlationId,
            itemIdsToLog.join(','),
            getNudgeLatency,
            validItemIdsToLog.join(','),
            getNudgesResponseWithError.errorOrStatus,
            '',
            getNudgesResponseWithError.retryAttempt
        );
    } else {
        logGetNudgeDatapoint(
            0,
            0,
            0,
            source,
            correlationId,
            '',
            getNudgeLatency,
            '',
            getNudgesResponseWithError.errorOrStatus,
            scrubForPii(getNudgesResponseWithError.errorDetails),
            getNudgesResponseWithError.retryAttempt
        );
    }

    const testNudgeURIString = getQueryStringParameter('testOldNudge');
    const testNudgeString = decodeURIComponent(testNudgeURIString || '').trim();
    if (testNudgeString.length != 0) {
        newNudges.push({
            rowKey: 'testNudgeRowKey',
            itemId: 'getTestNudgeRowDataForRowNotLoadedInTableViewItemId=',
            conversationId: 'getTestNudgeRowDataForRowNotLoadedInTableViewConversationId=',
            tableViewId: tableView.id,
            reason: NudgedReason.ReceivedDaysAgo,
            daysAgo: 7,
            nudgeItemTime: '2020-08-31T17:00:00-07:00',
            entryId: 'testEntryId',
        });
        const newOldNudgeRow = getTestNudgeRowDataForRowNotLoadedInTableView();

        if (tableView.rowKeys.indexOf('testNudgeRowKey') < 0) {
            const indexToInsertAt = getFirstUnpinnedRowIndex(tableView, 0 /*startIndex*/);
            TableOperations.addRow(indexToInsertAt, newOldNudgeRow, tableView);
        }
    }

    newNudges.push(...getClientNudgesIfTesting(tableView));

    /**
     * Update positions for existing nudges in the current table if we have not received them as nudge anymore.
     * GetNudges call may return a different nudge from a previous call,
     * and client needs to return the item that we had previous nudged,
     * that are not in the latest response, to its original position
     */
    getStore().nudgedRows.forEach(oldNudgedRow => {
        const oldNudgeRowKey = oldNudgedRow.rowKey;

        if (
            oldNudgedRow.tableViewId == tableView.id &&
            !newNudges.some(
                newNudgedRow =>
                    newNudgedRow.rowKey === oldNudgeRowKey &&
                    newNudgedRow.tableViewId === oldNudgedRow.tableViewId
            )
        ) {
            updatePreviouslyNudgedRowToOriginalPosition(oldNudgeRowKey, tableView);
            logNudgeRemoved(oldNudgeRowKey, 'NotReceivedAsNudgeAnyMore', oldNudgedRow.reason);
        }

        /**
         * We should not be overriding the nudges that are in the store for the table that is not
         * currently selected. The reason being when switching back to this table we still want to
         * know if a row is nudge or not before we end up making a new GetNudges call for that table.
         */
        if (oldNudgedRow.tableViewId != tableView.id) {
            newNudges.push(oldNudgedRow);
        }
    });

    // Add nudges to store
    // Add nudges to list view
    onGetNudgesCompleted(newNudges, tableView);

    trace.info('Nudge: onSelectFolderCompleteOrchestrator new nudges length: ' + newNudges.length);

    isLoadingNudge = false;
}

function getNudgeItemId(nudge: Nudge) {
    if (isFeatureEnabled('fwk-immutable-ids') || isHostAppFeatureEnabled('nativeResolvers')) {
        return nudge.ImmutableId.Id;
    }

    return nudge.ItemId.Id;
}

async function processNudgeResponse(
    nudge: Nudge,
    tableView: TableView,
    correlationId: string,
    isInboxTable: boolean,
    source: string
): Promise<NudgedRow> {
    try {
        let nudgedRowKey;
        let nudgeDiscardReason;
        const nudgeItemId = getNudgeItemId(nudge);
        const nudgeConversationId = nudge.ConversationId.Id;
        const nudgeReason = nudge.NudgeReason.Reason;
        const isConversationListViewType = isConversationView(tableView);
        const rowId = isConversationListViewType ? nudgeConversationId : nudgeItemId;
        const rowKeys = getRowKeysFromRowIds([rowId], tableView);
        const isNudgeFromOtherTable = isInboxTable
            ? nudgeReason == 'Sent'
            : nudgeReason == 'Received';
        const nudgedReason = getNudgedReasonFromResponse(nudge.NudgeReason.Reason);

        // Case 1 - Row was not found in the client table, try to fetch its data and add to table if its valid
        if (rowKeys.length === 0) {
            const nudgedRowToAdd = await getNudgedRowData(rowId, tableView);
            nudgeDiscardReason = validateServerRowAsNudge(
                nudgedRowToAdd,
                nudgeItemId,
                nudgeConversationId,
                correlationId,
                isConversationListViewType,
                tableView,
                isInboxTable,
                isNudgeFromOtherTable,
                source,
                nudge.MessageReceivedOrSentTimeUTC
            );

            nudgedRowKey = nudgedRowToAdd?.InstanceKey;
            if (!nudgeDiscardReason) {
                // Add the row, if it's not added by the time we got data
                if (tableView.rowKeys.indexOf(nudgedRowKey) < 0) {
                    const indexToInsertAt = getFirstUnpinnedRowIndex(tableView, 0 /*startIndex*/);
                    TableOperations.addRow(indexToInsertAt, nudgedRowToAdd, tableView);
                }
            }
        } else {
            // Case 2 - Row was found in the table, validate if its valid nudge
            nudgeDiscardReason = validateExistingRowAsNudge(
                nudgeItemId,
                nudgeConversationId,
                correlationId,
                tableView,
                isInboxTable,
                rowKeys[0],
                source,
                true,
                nudge.MessageReceivedOrSentTimeUTC,
                nudgedReason
            );
            nudgedRowKey = rowKeys[0];
        }

        if (!nudgeDiscardReason && nudgedRowKey) {
            // Pre-fetch row data
            prefetchNudgeDataIfNeeded(tableView.tableQuery, rowId);

            // Use received or sent time on nudge if present when calculating age
            const lastDeliveryTime =
                nudge.MessageReceivedOrSentTimeUTC ||
                MailRowDataPropertyGetter.getLastDeliveryTimeStamp(nudgedRowKey, tableView);
            const ageInDays = differenceInCalendarDays(userDate(), userDate(lastDeliveryTime));
            return {
                rowKey: nudgedRowKey,
                itemId: nudgeItemId,
                conversationId: nudgeConversationId,
                tableViewId: tableView.id,
                reason: nudgedReason,
                daysAgo: ageInDays,
                nudgeItemTime: nudge.MessageReceivedOrSentTimeUTC,
                entryId: nudge.ItemId.Id,
            };
        } else {
            // Nudge row could not be found or placed as nudge in the table
            return null;
        }
    } catch (error) {
        trace.warn('Nudge: processNudgeResponse throws an exception' + error.message);
        return null;
    }
}

/**
 * @param totalNudgeCount we get nudges for inbox and sentitems
 * @param totalNudgesForCurrentTable we get nudges for inbox and sentitems
 * @param numberOfNewNudges count of nudge rows for which we found data
 * @param source Source of Get nudges
 * @param correlationId correlation id
 * @param itemIds ItemIds for all nudged received
 * @param getNudgeLatency Latency of this request
 * @param validItemIds ItemIds for valid items
 * @param errorString errors
 */
function logGetNudgeDatapoint(
    totalNudgeCount: number,
    totalNudgesForCurrentTable: number,
    numberOfNewNudges: number,
    source: string,
    correlationId: string,
    itemIds: string,
    getNudgeLatency: number,
    validItemIds: string,
    errorOrStatus: string,
    errorResponseBody: string,
    retryAttempt: number
) {
    logUsage('Nudge_GetNudge', {
        owa_1: totalNudgeCount,
        owa_2: totalNudgesForCurrentTable,
        owa_3: numberOfNewNudges,
        owa_4: source,
        cId: correlationId,
        itemId: itemIds,
        latency: getNudgeLatency,
        validItemId: validItemIds,
        error: errorOrStatus?.toString(),
        errorMessage: errorResponseBody,
        retryAttempt: retryAttempt,
    });
}

function prefetchNudgeDataIfNeeded(tableQuery: TableQuery, rowId: string) {
    if (tableQuery.listViewType === ReactListViewType.Message) {
        const cachedItem = getMailStore().items.get(rowId);
        if (!cachedItem || !cachedItem.NormalizedBody) {
            lazyLoadItem.importAndExecute(
                {
                    Id: rowId,
                    mailboxInfo: getMailboxInfoFromTableQuery(tableQuery),
                },
                'LoadNudgedItem'
            );
        }
    } else if (!getMailStore().conversations.get(rowId)) {
        lazyLoadConversation.importAndExecute(
            {
                Id: rowId,
                mailboxInfo: getMailboxInfoFromTableQuery(tableQuery),
            },
            'LoadNudgedConversation'
        );
    }
}
