import { getMailboxRequestOptions } from 'owa-request-options-types';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { ClientItemId } from 'owa-client-ids';
import { getEwsRequestString } from 'owa-datetime';
import type { DateRange } from 'owa-datetime-utils';
import type ExpandCalendarEventResponse from 'owa-service/lib/contract/ExpandCalendarEventResponse';
import expandCalendarEventRequest from 'owa-service/lib/factory/expandCalendarEventRequest';
import itemId from 'owa-service/lib/factory/itemId';
import expandCalendarEventOperation from 'owa-service/lib/operation/expandCalendarEventOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

/**
 * Action to expand a recurring calendar item from the server.
 * @param masterCalendarItemId The recurring item master id
 * @param dateRange The date range for bounding the expansion
 */
export default async function expandCalendarEventService(
    masterCalendarItemId: ClientItemId,
    dateRange: DateRange
): Promise<ExpandCalendarEventResponse> {
    const request = {
        Header: getJsonRequestHeader(),
        Body: expandCalendarEventRequest({
            EventId: itemId({
                Id: masterCalendarItemId.Id,
            }),
            WindowStart: getEwsRequestString(dateRange.start),
            WindowEnd: getEwsRequestString(dateRange.end),
            ReturnMaster: true,
            ReturnRegularOccurrences: true,
            ReturnExceptions: true,
            ReturnCancellations: true,
            IncludeDeclinedMeetings: isFeatureEnabled('cal-surface-declinedMeetings'),
        }),
    };

    const response = await expandCalendarEventOperation(
        request,
        getMailboxRequestOptions(masterCalendarItemId.mailboxInfo)
    );

    return response.Body as ExpandCalendarEventResponse;
}
