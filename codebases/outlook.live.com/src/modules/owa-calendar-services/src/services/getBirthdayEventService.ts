import { getMailboxRequestOptions } from 'owa-request-options-types';
import type { ClientItemId } from 'owa-client-ids';
import getBirthdayEventRequest from 'owa-service/lib/factory/getBirthdayEventRequest';
import itemId from 'owa-service/lib/factory/itemId';
import getBirthdayEventOperation from 'owa-service/lib/operation/getBirthdayEventOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type BirthdayEvent from 'owa-service/lib/contract/BirthdayEvent';
import type GetBirthdayEventJsonResponse from 'owa-service/lib/contract/GetBirthdayEventJsonResponse';
import type RequestOptions from 'owa-service/lib/RequestOptions';

export interface BirthdayEventServiceResponse {
    calendarEvent: BirthdayEvent;
    error: string;
}

/**
 * Makes the GetBirthdayEvent call to the server to get the calendar event object
 * @param calendarEventId id of the calendar event that needs to be fetched
 * @param parentFolderId the folder Id of the event
 */
export async function getBirthdayEventService(
    calendarEventId: ClientItemId
): Promise<BirthdayEventServiceResponse> {
    const { Id: id, mailboxInfo } = calendarEventId;

    const requestOptions: RequestOptions = getMailboxRequestOptions(mailboxInfo) || {};
    requestOptions.datapoint = {
        customData: {
            itemId: id,
        },
        jsonCustomData: (json: GetBirthdayEventJsonResponse) => ({
            responseClass: json?.Body?.ResponseClass,
            responseCode: json?.Body?.ResponseCode,
        }),
    };
    const response = await getBirthdayEventOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getBirthdayEventRequest({
                CalendarItemId: itemId({ Id: id }),
            }),
        },
        requestOptions
    );

    if (response.Body != null && response.Body.ResponseClass == 'Success') {
        let birthdayEvent = response.Body.BirthdayEvent as BirthdayEvent;
        if (birthdayEvent != null) {
            return {
                calendarEvent: birthdayEvent,
                error: null,
            };
        }
    }
    // In case of error, we are ignoring it
    return { calendarEvent: null, error: '[getBirthdayEventService] request failed' };
}
