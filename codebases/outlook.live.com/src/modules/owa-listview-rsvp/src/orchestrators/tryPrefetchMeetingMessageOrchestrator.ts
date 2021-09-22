import { parseGetItemResponseAction } from '../actions/parseGetItemResponseAction';
import { tryPrefetchMeetingMessage } from '../actions/publicActions';
import * as meetingRSVPMapOperations from '../utils/meetingRSVPMapOperations';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import type { ClientItemId } from 'owa-client-ids';
import { getTableConversationRelation } from 'owa-mail-list-store';
import { getItem, mailStore } from 'owa-mail-store';
import getMeetingItem from 'owa-meeting-message/lib/utils/getMeetingItem';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import prefetch from 'owa-service/lib/prefetch';
import { trace } from 'owa-trace';
import { orchestrator } from 'satcheljs';
import shouldMeetingItemShowRSVP from '../utils/shouldMeetingItemShowRSVP';
import {
    updateMailStoreForRsvp,
    updateTableRelationMapForRsvp,
} from '../mutators/updateStoreForLoadItemRsvpResponse';

const meetingDetailsProperties = [
    propertyUri({ FieldURI: 'Start' }),
    propertyUri({ FieldURI: 'End' }),
    propertyUri({ FieldURI: 'AssociatedCalendarItemId' }),
    propertyUri({ FieldURI: 'RecurrenceId' }),
    propertyUri({ FieldURI: 'Recurrence' }),
    propertyUri({ FieldURI: 'ConflictingMeetings' }),
    propertyUri({ FieldURI: 'CalendarItemType' }),
    propertyUri({ FieldURI: 'IsResponseRequested' }),
    propertyUri({ FieldURI: 'Organizer' }),
    propertyUri({ FieldURI: 'ItemClass' }),
    propertyUri({ FieldURI: 'MeetingRequestType' }),
    propertyUri({ FieldURI: 'ItemParentId' }),
    propertyUri({ FieldURI: 'Sender' }),
    propertyUri({ FieldURI: 'ConversationId' }),
    propertyUri({ FieldURI: 'IsDelegated' }),
    propertyUri({ FieldURI: 'ReceivedRepresenting' }),
    propertyUri({ FieldURI: 'ResponseType' }),
];

orchestrator(tryPrefetchMeetingMessage, actionMessage => {
    const { listViewType, mailboxInfo, shouldDelayPrefetch } = actionMessage;

    const mailboxSmtpAddress = mailboxInfo.mailboxSmtpAddress;
    const rowInfosToGetRSVP = meetingRSVPMapOperations.getFetchList(mailboxSmtpAddress);
    meetingRSVPMapOperations.removeFromFetchList(mailboxSmtpAddress);

    if (!rowInfosToGetRSVP || rowInfosToGetRSVP.length === 0) {
        // No-op if nothing to fetch
        return;
    }

    const clientItemIds = rowInfosToGetRSVP.map(rowInfo => {
        return { Id: rowInfo.itemId, mailboxInfo: mailboxInfo };
    });

    if (shouldDelayPrefetch) {
        prefetch(() => {
            loadItemWithErrorHandling(clientItemIds, rowInfosToGetRSVP, listViewType);
        });
    } else {
        loadItemWithErrorHandling(clientItemIds, rowInfosToGetRSVP, listViewType);
    }
});

async function loadItemWithErrorHandling(
    clientItemIds: ClientItemId[],
    rowInfosToGetRSVP: meetingRSVPMapOperations.RowInfoToGetRSVP[],
    listViewType: ReactListViewType
) {
    const datapoint: PerformanceDatapoint = new PerformanceDatapoint('LoadMeetingMessage');
    datapoint.addCustomProperty('count', clientItemIds.length);

    const itemIdsString = clientItemIds.map(clientItemId => clientItemId.Id);
    try {
        const allSucceededItems = await getItem(
            itemIdsString,
            itemResponseShape({
                BaseShape: 'IdOnly',
                AdditionalProperties: meetingDetailsProperties,
            }),
            null,
            null,
            null,
            null,
            null,
            null,
            'RSVPInListView',
            true
        );

        if (allSucceededItems && !(allSucceededItems instanceof Error)) {
            const successFullItemIds = clientItemIds.filter(itemIdRequested =>
                allSucceededItems.some(
                    responseItem => responseItem.ItemId.Id === itemIdRequested.Id
                )
            );

            parseGetItemResponseAction(allSucceededItems, successFullItemIds);
            datapoint.end();
        } else {
            datapoint.endWithError(DatapointStatus.ServerError);
        }

        // If at least one of the responses failed, lets add some traces on these Ids
        if (
            allSucceededItems instanceof Error ||
            allSucceededItems.length !== itemIdsString.length
        ) {
            trace.warn(`[loadingmeetingmessage] some items failed in: ${itemIdsString}`);
        }
    } catch (error) {
        datapoint.endWithError(DatapointStatus.ServerError, Error(error));
        trace.warn(`[loadingmeetingmessage] all items failed in: ${itemIdsString}`);
    }

    // This will go through all the ids that we requested and check
    // which items have all the properties we need, otherwise the GetItem failed for them
    handleLoadItemResponse(listViewType, rowInfosToGetRSVP);
}

/**
 * Handle load item response
 * @param listViewType the type of the list view
 * @param itemIds the itemIds if this is for the message view
 */
function handleLoadItemResponse(
    listViewType: ReactListViewType,
    rowInfosToGetRSVP: meetingRSVPMapOperations.RowInfoToGetRSVP[]
) {
    rowInfosToGetRSVP.forEach(rowInfo => {
        if (listViewType === ReactListViewType.Message) {
            // mailstore item's shouldShowRSVP determines whether to display the meeting message item from list view store
            const mailStoreItem = mailStore.items.get(rowInfo.itemId);

            // If the message has already been deleted, no clean up is necessary
            if (!mailStoreItem) {
                return;
            }

            // The item is not a meeting item or no properties exist for the item on the store.
            const meetingItem = getMeetingItem(rowInfo.itemId);
            if (!meetingItem || !shouldMeetingItemShowRSVP(meetingItem)) {
                updateMailStoreForRsvp(mailStoreItem, false);
            }
        } else {
            const tableConversationRelation = getTableConversationRelation(
                rowInfo.rowKey,
                rowInfo.tableViewId
            );

            // The conversation is not in the cache anymore
            if (!tableConversationRelation) {
                return;
            }

            // The item is not a meeting item or no properties exist for the item on the store.
            const meetingItem = getMeetingItem(rowInfo.itemId);
            if (!meetingItem || !shouldMeetingItemShowRSVP(meetingItem)) {
                updateTableRelationMapForRsvp(tableConversationRelation, false);
            }
        }
    });
}
