import type GetBirthdayCalendarViewResponse from 'owa-service/lib/contract/GetBirthdayCalendarViewResponseMessage';
import getBirthdayCalendarViewRequest from 'owa-service/lib/factory/getBirthdayCalendarViewRequest';
import getBirthdayCalendarViewOperation from 'owa-service/lib/operation/getBirthdayCalendarViewOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type { CalendarId } from 'owa-graph-schema';
import { getMailboxRequestOptions } from 'owa-request-options-types';

/**
 * Makes the GetBirthdayCalendarView call to the server to get calendar items for birthday calendar
 * @param {string} rangeStart start of request range in EWS format
 * @param {string} rangeEnd end of request range in EWS format
 * @param {string} folderId folder id of requested calendar
 * @returns promise of GetBirthdayCalendarViewResponse type
 */
export default async function getBirthdayCalendarViewService(
    rangeStart: string,
    rangeEnd: string,
    calendarId: CalendarId
): Promise<GetBirthdayCalendarViewResponse> {
    const response = await getBirthdayCalendarViewOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getBirthdayCalendarViewRequest({
                StartRange: rangeStart,
                EndRange: rangeEnd,
            }),
        },
        getMailboxRequestOptions(calendarId.mailboxInfo)
    );

    return response.Body;
}
