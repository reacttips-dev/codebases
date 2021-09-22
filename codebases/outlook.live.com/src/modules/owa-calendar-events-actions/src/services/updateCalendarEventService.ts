import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import type EventScope from 'owa-service/lib/contract/EventScope';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type ItemChange from 'owa-service/lib/contract/ItemChange';
import updateCalendarEventOperation from 'owa-service/lib/operation/updateCalendarEventOperation';
import updateCalendarEventRequest from 'owa-service/lib/factory/updateCalendarEventRequest';
import type UpdateItemResponseMessage from 'owa-service/lib/contract/UpdateItemResponseMessage';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type { MailboxInfo } from 'owa-client-ids';

/**
 * Makes the UpdateCalendarEvent call to the server
 * @param singleOrSeriesId id of the CalendarEvent that needs to be updated (single or series)
 * @param itemChange the set of properties that changed and will be sent to the server
 */
export default async function updateCalendarEventService(
    timeZoneId: string,
    singleOrSeriesId: BaseItemId,
    mailboxInfo: MailboxInfo,
    itemChange: ItemChange,
    eventScope: EventScope,
    shouldSendUpdateToAttendees: boolean,
    updateAsCoOrganizer?: boolean
): Promise<UpdateItemResponseMessage> {
    const request = updateCalendarEventRequest({
        EventId: singleOrSeriesId,
        ItemChange: itemChange,
        EventScope: eventScope,
    });
    if (shouldSendUpdateToAttendees) {
        request.ShouldSendUpdateToAttendees = true;
    }

    if (updateAsCoOrganizer) {
        // When an attendee makes an update to the event, we have to send UpdateAsCoOrganizer flag to the server
        request.UpdateAsCoOrganizer = updateAsCoOrganizer;
    }

    // The server seems unable (or unwilling) to respect recurrence start/end
    // dates that are sent with time zone offsets (UTC or others). So the only
    // way I see for recurrence to be created properly when other time zones
    // are selected is for us to send the recurrence range as plain dates and
    // for the request to go out with the event's start time zone in the header.
    // This is how jsMVVM did it, so we'll replicate it here.
    const Header = getJsonRequestHeader();
    Header.TimeZoneContext.TimeZoneDefinition.Id = timeZoneId;

    const response = await updateCalendarEventOperation(
        {
            Header,
            Body: request,
        },
        getMailboxRequestOptions(mailboxInfo)
    );

    return response.Body.ResponseMessages.Items[0] as UpdateItemResponseMessage;
}
