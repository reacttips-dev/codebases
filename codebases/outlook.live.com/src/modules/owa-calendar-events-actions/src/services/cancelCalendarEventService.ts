import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import bodyContentType from 'owa-service/lib/factory/bodyContentType';
import cancelCalendarEventOperation from 'owa-service/lib/operation/cancelCalendarEventOperation';
import cancelCalendarEventRequest from 'owa-service/lib/factory/cancelCalendarEventRequest';
import type EventScope from 'owa-service/lib/contract/EventScope';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type { MailboxInfo } from 'owa-client-ids';

export default async function cancelCalendarEventService(
    cancelCalendarEventId: BaseItemId,
    eventScope: EventScope,
    mailboxInfo: MailboxInfo,
    notes?: string
): Promise<SingleResponseMessage> {
    var request = {
        Header: getJsonRequestHeader(),
        Body: cancelCalendarEventRequest({
            EventId: cancelCalendarEventId,
            EventScope: eventScope,
        }),
    };

    if (notes) {
        request.Body.Notes = bodyContentType({
            BodyType: 'HTML',
            Value: notes,
        });
    }

    const response = await cancelCalendarEventOperation(
        request,
        getMailboxRequestOptions(mailboxInfo)
    );

    return response.Body;
}
