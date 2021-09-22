import { getMailboxRequestOptions } from 'owa-request-options-types';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { ClientItemId } from 'owa-client-ids';
import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import getCalendarEventRequest from 'owa-service/lib/factory/getCalendarEventRequest';
import getCalendarEventOperation from 'owa-service/lib/operation/getCalendarEventOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { logServiceCallForDiagnostics } from 'owa-calendar-forms-diagnostics';
import type GetCalendarEventJsonResponse from 'owa-service/lib/contract/GetCalendarEventJsonResponse';
import intitializeLocations from '../utils/intitializeLocations';
import type { GetCalendarEventResponse } from '../schema/GetCalendarEventResponse';
import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { RequestQueue, createRequestQueue } from 'owa-service-utils';

const REDIRECT_TO_CALENDAR_SERVICE_HEADER_KEY = 'X-RedirectToCalendarService';
const MAX_NUM_REQUESTS = 7;
let getCalendarEventRequestQueue: RequestQueue | null = null;

/**
 * Makes the GetCalendarEvent call to the server to get the calendar event object
 * @param id id of the calendar event that needs to be fetched
 * @param shape shape of the calendar event object that will be returned
 * @param eventScope flag which says whether we want series master or series instance
 */
export async function getCalendarEventService(
    calendarEventId: ClientItemId,
    shape: ItemResponseShape,
    fetchingMasterItem: boolean,
    eventIds: BaseItemId[],
    parentFolderId: string = undefined
): Promise<GetCalendarEventResponse> {
    const { Id: id, mailboxInfo } = calendarEventId;

    let responseMessage,
        response = null;
    let result: GetCalendarEventResponse = null;

    const requestOptions: RequestOptions = getMailboxRequestOptions(mailboxInfo) || {};
    requestOptions.datapoint = {
        customData: {
            itemId: id,
            fetchingMasterItem: fetchingMasterItem,
        },
        jsonCustomData: (json: GetCalendarEventJsonResponse) => {
            let message = json.Body.ResponseMessages.Items[0] as ItemInfoResponseMessage;
            return {
                responseClass: message.ResponseClass,
                responseCode: message.ResponseCode,
            };
        },
    };

    if (isFeatureEnabled('platform-redirectToCalendarService')) {
        if (!requestOptions.headers) {
            requestOptions.headers = new Headers();
        }

        requestOptions.headers.set(REDIRECT_TO_CALENDAR_SERVICE_HEADER_KEY, 'true');
    }

    try {
        response = await getQueue().add(() =>
            getCalendarEventOperation(
                {
                    Header: getJsonRequestHeader(),
                    Body: getCalendarEventRequest({
                        EventIds: eventIds,
                        ItemShape: shape,
                        IncludeDeclinedMeetings: isFeatureEnabled('cal-surface-declinedMeetings'),
                    }),
                },
                requestOptions
            )
        );
        responseMessage = response.Body.ResponseMessages.Items[0] as ItemInfoResponseMessage;
        if (responseMessage.ResponseClass == 'Success') {
            if (responseMessage != null) {
                let calendarItem = responseMessage.Items[0] as CalendarItem;

                if (calendarItem != null) {
                    // When rooms are added from legacy clients the locations collection doesn't contain the room, but the resources collection has it.
                    // Instead Locations can contain a string location that is the display name of the room.
                    // This is a client work around to initialize location collection from resources collection.
                    // server bug is https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/46946
                    intitializeLocations(calendarItem);

                    // In the case of fetching channel events, we have a customized cache while saving folder Ids
                    // Hence, we revert the calendarItem's parentFolderId back to the customized value to keep client in sync.
                    if (parentFolderId) {
                        calendarItem.ParentFolderId.Id = parentFolderId;
                    }

                    result = {
                        calendarEvent: calendarItem,
                        error: null,
                        responseCode: responseMessage.ResponseCode,
                    };
                }
            } else {
                result = {
                    calendarEvent: null,
                    error: '[getCalendarEventService] null response.',
                    responseCode: responseMessage.ResponseCode,
                };
            }
        } else {
            const errorMessage = `[getCalendarEventService] request failed. Message: ${responseMessage.MessageText}, ResponseCode: ${responseMessage.ResponseCode}, ResponseClass: ${responseMessage.ResponseClass}`;
            result = {
                calendarEvent: null,
                error: errorMessage,
                responseCode: responseMessage.ResponseCode,
            };
        }
    } catch (e) {
        result = {
            calendarEvent: null,
            error: e.message,
        };
    } finally {
        // Log the service call for forms diagnostics panel, regardless of whether the request succeeded or threw exception
        if (isFeatureEnabled('cal-mf-diagnostics')) {
            logServiceCallForDiagnostics({
                action: 'GetCalendarEvent',
                status: responseMessage?.ResponseClass || 'Error',
                response: response?.Body,
            });
        }
    }

    return result;
}

function getQueue(): RequestQueue {
    if (getCalendarEventRequestQueue == null) {
        getCalendarEventRequestQueue = createRequestQueue(MAX_NUM_REQUESTS);
    }
    return getCalendarEventRequestQueue;
}
