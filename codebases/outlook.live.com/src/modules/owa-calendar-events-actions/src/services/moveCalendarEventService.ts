import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import folderIdFactory from 'owa-service/lib/factory/folderId';
import itemId from 'owa-service/lib/factory/itemId';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import moveItemOperation from 'owa-service/lib/operation/moveItemOperation';
import moveItemRequest from 'owa-service/lib/factory/moveItemRequest';
import targetFolderId from 'owa-service/lib/factory/targetFolderId';
import type { ClientItemId, ClientFolderId } from 'owa-client-ids';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { getMailboxRequestOptions } from 'owa-request-options-types';

/**
 * changes the parent id of a calendar item on server
 * We Have named this move single calendar item since the moveItem operation allows the movement of multiple items to a new calendar and here
 * @param calendar instance of calendar
 * @param newCalendarName new calendar name
 */
export default async function moveCalendarEventService(
    eventId: ClientItemId,
    destinationFolderId: ClientFolderId
): Promise<ItemInfoResponseMessage> {
    const response = await moveItemOperation(
        {
            Header: getJsonRequestHeader(),
            Body: moveItemRequest({
                ToFolderId: targetFolderId({
                    BaseFolderId: folderIdFactory({ Id: destinationFolderId.Id }),
                }),
                ItemIds: [itemId({ Id: eventId.Id }) as BaseItemId],
            }),
        },
        getMailboxRequestOptions(destinationFolderId.mailboxInfo)
    );

    return response.Body.ResponseMessages.Items[0] as ItemInfoResponseMessage;
}
