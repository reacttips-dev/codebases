import folderIdFactory from 'owa-service/lib/factory/folderId';
import getCalendarViewOperation from 'owa-service/lib/operation/getCalendarViewOperation';
import getCalendarViewRequest from 'owa-service/lib/factory/getCalendarViewRequest';
import type GetCalendarViewResponse from 'owa-service/lib/contract/GetCalendarViewResponse';
import targetFolderId from 'owa-service/lib/factory/targetFolderId';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type { CalendarId } from 'owa-graph-schema';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import { createRequestQueue, RequestQueue } from 'owa-service-utils';

const HEADER_EXPLICIT_LOGON_USER: string = 'X-OWA-ExplicitLogonUser';
const HEADER_ANCHOR_MAILBOX: string = 'X-AnchorMailbox';

const MAXIMUM_NUM_REQUESTS = 6;
let requestQueue: RequestQueue = null;

// TODO VSO 114554: update calendar events services to consume ISO string dates
/**
 * Makes the GetCalendarView call to the server to get calendar items for default calendar
 * @param {string} rangeStart start of request range in EWS format
 * @param {string} rangeEnd end of request range in EWS format
 * @param {string} folderId folder id of requested calendar
 * @param {string} explicitLogonEmail smtp addres of request mailbox (in case of LinkedCalendar entries)
 * @returns promise of GetCalendarViewResponse type
 */
export default function getCalendarViewService(
    rangeStart: string,
    rangeEnd: string,
    folderId: string,
    calendarId?: CalendarId,
    explicitLogonEmail?: string,
    includeDeclinedMeetings?: boolean
): Promise<GetCalendarViewResponse> {
    let options = null;
    // if explicitLogonEmail is sent (usually only for the case of LinkedCalendar entries), use that
    if (explicitLogonEmail) {
        options = {
            headers: <any>{
                [HEADER_EXPLICIT_LOGON_USER]: explicitLogonEmail,
                [HEADER_ANCHOR_MAILBOX]: explicitLogonEmail,
            },
        };
    } else if (calendarId) {
        options = getMailboxRequestOptions(calendarId.mailboxInfo);
    }

    if (!requestQueue) {
        requestQueue = createRequestQueue(MAXIMUM_NUM_REQUESTS);
    }

    return requestQueue.add(() => {
        const req = {
            Header: getJsonRequestHeader(),
            Body: getCalendarViewRequest({
                CalendarId: targetFolderId({
                    BaseFolderId: folderIdFactory({ Id: folderId }),
                }),
                RangeStart: rangeStart,
                RangeEnd: rangeEnd,
                IncludeDeclinedMeetings: includeDeclinedMeetings,
            }),
        };

        return getCalendarViewOperation(req, options).then(response => response.Body);
    });
}
