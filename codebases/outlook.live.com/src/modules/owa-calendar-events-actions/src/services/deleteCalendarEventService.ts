import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import deleteCalendarEventOperation from 'owa-service/lib/operation/deleteCalendarEventOperation';
import deleteCalendarEventRequest from 'owa-service/lib/factory/deleteCalendarEventRequest';
import type EventScope from 'owa-service/lib/contract/EventScope';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type { MailboxInfo } from 'owa-client-ids';

export default async function deleteCalendarEventService(
    deleteCalendarEventId: BaseItemId,
    eventScope: EventScope,
    mailboxInfo: MailboxInfo
): Promise<SingleResponseMessage> {
    let body;

    if (eventScope) {
        body = deleteCalendarEventRequest({
            EventId: deleteCalendarEventId,
            EventScope: eventScope,
        });
    } else {
        body = deleteCalendarEventRequest({
            EventId: deleteCalendarEventId,
        });
    }

    const response = await deleteCalendarEventOperation(
        {
            Header: getJsonRequestHeader(),
            Body: body,
        },
        getMailboxRequestOptions(mailboxInfo)
    );

    return response.Body;
}
