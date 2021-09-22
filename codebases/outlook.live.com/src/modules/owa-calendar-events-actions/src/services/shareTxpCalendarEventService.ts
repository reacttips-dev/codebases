import EventScope from 'owa-service/lib/contract/EventScope';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type ShareTailoredExperienceEventJsonResponse from 'owa-service/lib/contract/ShareTailoredExperienceEventJsonResponse';
import shareTailoredExperienceEventOperation from 'owa-service/lib/operation/shareTailoredExperienceEventOperation';
import shareTailoredExperienceEventRequest from 'owa-service/lib/factory/shareTailoredExperienceEventRequest';
import type ShareTailoredExperienceEventRequest from 'owa-service/lib/contract/ShareTailoredExperienceEventRequest';
import type { ClientItemId } from 'owa-client-ids';
import { getItemIdToUpdate } from 'owa-calendar-events-store';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

/**
 * Service wrapper for TXP share event
 */
export default function shareTxpCalendarEventService(
    calendarItemId: ClientItemId,
    requestBody: Pick<ShareTailoredExperienceEventRequest, 'RecipientEmailAddresses' | 'Note'>
): Promise<ShareTailoredExperienceEventJsonResponse> {
    const request = {
        Header: getJsonRequestHeader(),
        Body: shareTailoredExperienceEventRequest({
            EventId: getItemIdToUpdate(calendarItemId.Id, EventScope.Default),
            ...requestBody,
        }),
    };

    return shareTailoredExperienceEventOperation(
        request,
        getMailboxRequestOptions(calendarItemId.mailboxInfo)
    ).catch(error => null);
}
