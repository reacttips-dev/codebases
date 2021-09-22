import { isItemInSpotlightItemsCache, SpotlightCacheType } from './cacheUtils';
import convertRawSpotlightItemToConversationRow from './convertRawSpotlightItemToConversationRow';
import convertRawSpotlightItemToMessageRow from './convertRawSpotlightItemToMessageRow';
import onSpotlightRowsAppendedToTable from '../mutators/onSpotlightRowsAppendedToTable';
import type SpotlightItem from '../store/schema/SpotlightItem';
import SpotlightReason from '../store/schema/SpotlightReason';
import type { PerformanceDatapoint } from 'owa-analytics';
import { GenericKeys } from 'owa-analytics/lib/types/DatapointEnums';
import { owaDate } from 'owa-datetime';
import { appendRowResponse } from 'owa-mail-list-response-processor';
import { getRowKeysFromRowIds, isConversationView, TableView } from 'owa-mail-list-store';
import { getTableViewFromTableQuery } from 'owa-mail-triage-table-utils';
import type { OnInitialTableLoadComplete } from 'owa-mail-loading-action-types';
import { lazyLogResponseReceivedV2 } from 'owa-search-instrumentation';
import { SubstrateSearchScenario } from 'owa-search-service';
import { convertIdsToTargetFormat, ConvertIdSource } from 'owa-immutable-id';
import { getTargetFormat, isConversionNeeded } from 'owa-immutable-id-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { getUserMailboxInfo } from 'owa-client-ids';
import { isNudgedRow } from 'owa-mail-nudge-store';

export default async function processSpotlightItemsResponse(
    response: Response,
    inboxTableView: TableView,
    performanceDatapoint: PerformanceDatapoint,
    onInitialTableLoadComplete?: OnInitialTableLoadComplete
): Promise<SpotlightItem[]> {
    const spotlightItems: SpotlightItem[] = [];
    const rows = [];

    const isConversationListViewType = isConversationView(inboxTableView);
    const processedConversations = [];

    const spotlightResponse = await response.json();
    const rawSpotlightItems = spotlightResponse?.EntitySets?.[0]?.ResultSets?.[0]?.Results || [];

    lazyLogResponseReceivedV2.importAndExecute(
        SubstrateSearchScenario.ContextualInsights,
        spotlightResponse?.Instrumentation?.TraceId,
        <number>performanceDatapoint.getData(GenericKeys.e2eTimeElapsed) /* latency */,
        response.status
    );

    let shouldUseConvertedIds = false;
    let convertedIds = [];
    if (isFeatureEnabled('fwk-immutable-ids') || isHostAppFeatureEnabled('nativeResolvers')) {
        // GUSAN-TODO: Read new property from 3S that will contain the ImmutableId instead of converting them
        const itemIds = rawSpotlightItems.map(
            rawSpotlightItem => rawSpotlightItem.Source.ItemId?.Id
        );
        const userId = getUserMailboxInfo().userIdentity;
        if (isConversionNeeded(itemIds, userId)) {
            convertedIds = await convertIdsToTargetFormat(
                itemIds,
                getTargetFormat(userId),
                userId,
                ConvertIdSource.Spotlight
            );
            if (convertedIds.length === rawSpotlightItems.length) {
                shouldUseConvertedIds = true;
            }
        }
    }

    let index = 0;
    for (const rawSpotlightItem of rawSpotlightItems) {
        const conversationId = rawSpotlightItem.Source.ConversationId?.Id;
        const itemId = shouldUseConvertedIds
            ? convertedIds[index++]
            : rawSpotlightItem.Source.ItemId?.Id;
        const rowId = isConversationListViewType ? conversationId : itemId;
        const rowKey = getRowKey(rowId, inboxTableView);

        /**
         * If there was no row key found for the Spotlight item in the inbox,
         * then we'll drop it.
         */
        if (!rowKey) {
            continue;
        }

        /**
         * Because we don't have conversation support from the Spotlight API,
         * we dedupe any conversations that appear in the list of Spotlight
         * items multiple times.
         */
        if (isConversationListViewType) {
            if (processedConversations.indexOf(conversationId) > -1) {
                continue;
            } else {
                processedConversations.push(conversationId);
            }
        }

        // If this row is already a Nudge row, dont treat it as Spotlight
        if (isNudgedRow(rowKey, inboxTableView.id)) {
            continue;
        }

        /**
         * Convert Spotlight item from server to appropriate row so we
         * can load the "Important" filter table without additional
         * requests to the server.
         */
        if (
            !isItemInSpotlightItemsCache({
                spotlightCacheType: SpotlightCacheType.Dismissed,
                itemId: itemId,
                conversationId: conversationId,
                rowKey: rowKey,
            })
        ) {
            if (isConversationListViewType) {
                rows.push(
                    convertRawSpotlightItemToConversationRow(rawSpotlightItem.Source, rowKey)
                );
            } else {
                rows.push(convertRawSpotlightItemToMessageRow(rawSpotlightItem.Source, rowKey));
            }
        }

        // Add basic information about Spotlight items to the store.
        spotlightItems.push({
            conversationId: conversationId,
            itemId: itemId,
            rowKey: rowKey,
            isAcknowledged: isItemInSpotlightItemsCache({
                spotlightCacheType: SpotlightCacheType.Acknowledged,
                itemId,
                conversationId,
                rowKey: rowKey,
            }), // TODO: Remove when isAcknowledged is an actual property in response
            isDismissed: isItemInSpotlightItemsCache({
                spotlightCacheType: SpotlightCacheType.Dismissed,
                itemId,
                conversationId,
                rowKey: rowKey,
            }), // TODO: Remove when we can trust API
            reason: getSpotlightReason(rawSpotlightItem.Source.SingleValueExtendedProperties),
            senderName: rawSpotlightItem.Source.Sender?.EmailAddress?.Name,
            referenceId: rawSpotlightItem.ReferenceId,
            dateTimeReceived: owaDate(rawSpotlightItem.DateTimeReceived),
            isTeachingMomentTarget: false,
        });
    }

    // Determine which Spotlight item will be the teaching moment target.
    let mostRecentSpotlightItem = null;
    let mostRecentSpotlightItemIndex = null;
    for (let i = 0; i < spotlightItems.length; i++) {
        const spotlightItem = spotlightItems[i];

        // Update mostRecentSpotlightItem if the current item is newer than the
        // existing one (or if none is set yet).
        if (
            !mostRecentSpotlightItem ||
            spotlightItem.dateTimeReceived > mostRecentSpotlightItem.dateTimeReceived
        ) {
            mostRecentSpotlightItem = spotlightItem;
            mostRecentSpotlightItemIndex = i;
        }
    }

    if (mostRecentSpotlightItemIndex !== null) {
        spotlightItems[mostRecentSpotlightItemIndex].isTeachingMomentTarget = true;
    }

    /**
     * Add rows to the table used for the "Important" filter (which is the
     * inbox table view with a "spotlight" scenarioType).
     */
    const modifiedTableQuery = { ...inboxTableView.tableQuery, scenarioType: 'spotlight' };
    appendRowResponse(
        getTableViewFromTableQuery(modifiedTableQuery),
        rows,
        rows.length,
        'SpotlightLoad',
        null /* searchResponseId */,
        null /* searchLogicalId */,
        true /* doNotOverwriteData */
    );

    // Preserve reference to Spotlight table query for modifications later.
    onSpotlightRowsAppendedToTable(modifiedTableQuery);

    // We just need to set the table completed event on initial load
    // not on subsequent calls to fetch items
    if (onInitialTableLoadComplete) {
        onInitialTableLoadComplete(
            getTableViewFromTableQuery(modifiedTableQuery),
            true,
            response.status.toString() /* statusCode */,
            false /* isTablePrefetched */
        );
    }

    return spotlightItems;
}

const getRowKey = (rowId: string, inboxTableView: TableView): string => {
    const rowKeys = getRowKeysFromRowIds([rowId], inboxTableView);

    if (rowKeys.length > 0) {
        return rowKeys[0];
    }

    /**
     * If Spotlight item isn't found in inbox table (i.e. not yet loaded), return
     * null so that this item isn't processed.
     */
    return null;
};

const getSpotlightReason = (
    singleValueExtendedProperties: { Id: string; Value: string }[]
): SpotlightReason => {
    /**
     * If the SingleValueExtendedProperties array isn't available in the response,
     * then fall back to a generic reason code.
     */
    if (!singleValueExtendedProperties || singleValueExtendedProperties.length === 0) {
        return SpotlightReason.None;
    }

    for (const property of singleValueExtendedProperties) {
        /**
         * If the target property (SpotlightReason) is included in the array, then
         * return the appropriate (matching) SpotlightReason enum value.
         */
        if (property.Id.indexOf('SpotlightReason') > -1) {
            switch (property.Value) {
                case 'ActionRequired':
                    return SpotlightReason.ActionRequired;
                case 'AffectsSchedule':
                    return SpotlightReason.AffectsSchedule;
                case 'AtMentioned':
                    return SpotlightReason.AtMentioned;
                case 'ReplyRequired':
                    return SpotlightReason.ReplyRequired;
                case 'NewMeetingCreated':
                    return SpotlightReason.NewMeetingCreated;
                case 'UpcomingMeetingTimeChanged':
                    return SpotlightReason.UpcomingMeetingTimeChanged;
                case 'MeetingCanceled':
                    return SpotlightReason.MeetingCanceled;
                case 'NewMeetingTimeProposed':
                    return SpotlightReason.NewMeetingTimeProposed;
                case 'UltraFocused':
                    return SpotlightReason.UltraFocused;
                case 'ReplyToYourEmail':
                    return SpotlightReason.ReplyToYourEmail;
                default:
                    return SpotlightReason.None;
            }
        }
    }

    /**
     * If the target property (SpotlightReason) isn't included in the SingleValueExtendedProperties
     * array, then fall back to a generic reason code.
     */
    return SpotlightReason.None;
};
