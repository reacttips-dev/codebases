import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import createCalendarEventOperation from 'owa-service/lib/operation/createCalendarEventOperation';
import createItemRequest from 'owa-service/lib/factory/createItemRequest';
import folderId from 'owa-service/lib/factory/folderId';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import targetFolderId from 'owa-service/lib/factory/targetFolderId';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { toCalendarItem } from 'owa-calendar-event-converter';
import getOutboundCharset from 'owa-session-store/lib/selectors/getOutboundCharset';

/**
 * Calls createCalendarEvent to create given event
 */
export default async function newCalendarEventService(
    item: CalendarEvent
): Promise<ItemInfoResponseMessage> {
    let responseShape = itemResponseShape({
        BaseShape: 'IdOnly',
    });

    // We need to set the charm to undefined because the Create call will fail if specified.
    let serviceItem = toCalendarItem(item);
    // We have a bug in the server where passing a InstanceKey GUID was breaking.
    // While utah change is fixed/reverted, removing instanceKey from the create request so that REACT client is unblocked
    serviceItem.InstanceKey = undefined;

    let itemFolderId = targetFolderId({
        BaseFolderId: folderId({
            Id: item.ParentFolderId.Id,
        }),
    });

    // As this is a new calendar event so no ItemId will be there hence we use the parent folder id mailbox info
    let request = createItemRequest({
        Items: [serviceItem],
        SavedItemFolderId: itemFolderId,
        ClientSupportsIrm: true,
        UnpromotedInlineImageCount: 0,
        ItemShape: responseShape,
        SendMeetingInvitations: 'SendToNone',
        ...getOutboundCharset(),
    });

    // The server seems unable (or unwilling) to respect recurrence start/end
    // dates that are sent with time zone offsets (UTC or others). So the only
    // way I see for recurrence to be created properly when other time zones
    // are selected is for us to send the recurrence range as plain dates and
    // for the request to go out with the event's start time zone in the header.
    // This is how jsMVVM did it, so we'll replicate it here.
    const Header = getJsonRequestHeader();
    Header.TimeZoneContext.TimeZoneDefinition.Id = item.StartTimeZoneId;

    const response = await createCalendarEventOperation(
        {
            Header,
            Body: request,
        },
        getMailboxRequestOptions(item.ParentFolderId.mailboxInfo)
    );

    return response.Body.ResponseMessages.Items[0] as ItemInfoResponseMessage;
}
