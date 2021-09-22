import type AttendeeType from 'owa-service/lib/contract/AttendeeType';
import bodyContentType from 'owa-service/lib/factory/bodyContentType';
import type EventScope from 'owa-service/lib/contract/EventScope';
import type ForwardCalendarEventJsonResponse from 'owa-service/lib/contract/ForwardCalendarEventJsonResponse';
import forwardCalendarEventOperation from 'owa-service/lib/operation/forwardCalendarEventOperation';
import forwardCalendarEventRequest from 'owa-service/lib/factory/forwardCalendarEventRequest';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type { ClientItemId } from 'owa-client-ids';
import { getItemIdToUpdate } from 'owa-calendar-events-store';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

export default async function forwardCalendarEventService(
    calendarItemId: ClientItemId,
    forwardees: AttendeeType[],
    notes: string,
    eventScope: EventScope
): Promise<ForwardCalendarEventJsonResponse> {
    const request = {
        Header: getJsonRequestHeader(),
        Body: forwardCalendarEventRequest({
            Forwardees: forwardees.map(attendee => ({ ...attendee.Mailbox, RelevanceScore: 0 })),
            Importance: 'Normal',
            EventId: getItemIdToUpdate(calendarItemId.Id, eventScope),
        }),
    };
    if (notes) {
        request.Body.Notes = bodyContentType({
            BodyType: 'HTML',
            Value: notes,
        });
    }

    const response = await forwardCalendarEventOperation(
        request,
        getMailboxRequestOptions(calendarItemId.mailboxInfo)
    );

    return response.Body.ResponseClass === 'Success' ? response : null;
}
