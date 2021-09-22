import deleteCalendarEventRequest from 'owa-service/lib/factory/deleteCalendarEventRequest';
import deleteCalendarEventOperation from 'owa-service/lib/operation/deleteCalendarEventOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import itemId from 'owa-service/lib/factory/itemId';
import getCalendarEventRequest from 'owa-service/lib/factory/getCalendarEventRequest';
import getCalendarEventOperation from 'owa-service/lib/operation/getCalendarEventOperation';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import { getUserMailboxInfo } from 'owa-client-ids';
import { lazyLogDatapoint } from 'owa-analytics';
import UsageDatapoint from 'owa-analytics/lib/datapoints/UsageDatapoint';
import type { CustomData } from 'owa-analytics-types';
import { timestamp } from 'owa-datetime';
import { lazyShowCustomerFeedbackIntercept } from 'owa-intercept';

const SmartTimeFeatureName: string = 'SmartTime';
const MailSmartReplyWithMeetingEntryPoint = 'Mail_SmartReplyWithMeeting';

const onCloseRemoveDraftItem = (event: any) => {
    if (!event && event.data) {
        return;
    }

    if (typeof event.data === 'string') {
        const childWindowMessage = JSON.parse(event.data);

        if (childWindowMessage && childWindowMessage.source === 'calDraftItem') {
            if (childWindowMessage.entry === MailSmartReplyWithMeetingEntryPoint) {
                logUnsampledUsage(
                    'onFullCalendarComposeFormClosed',
                    SmartTimeFeatureName,
                    childWindowMessage.EID,
                    childWindowMessage.start
                );
            }
            removeCalendarDraftItem(childWindowMessage.id, childWindowMessage.entry);
        }
    }
};

export function setupRemoveDraftCalendarMeetingService() {
    window.addEventListener('message', onCloseRemoveDraftItem);
}

/**
 * Remove the newly created calendar draft item on user calendar if
 * it has not been sent yet. It will not remove calendar event that
 * has been sent out.
 * */
async function removeCalendarDraftItem(calendarItemId: string, entryPoint: string) {
    if (calendarItemId) {
        const isDraft = await isDraftCalendarItem(calendarItemId);
        if (isDraft) {
            // reference "FullComposeEntrySourceType" for entryPoint definition
            if (entryPoint === MailSmartReplyWithMeetingEntryPoint) {
                // Microsoft User Research for getting customer feedback init Smart Time but did not finish the workflow
                lazyShowCustomerFeedbackIntercept.importAndExecute({
                    featureName: SmartTimeFeatureName,
                });
            }

            const body = deleteCalendarEventRequest({
                EventId: itemId({ Id: calendarItemId }),
            });

            await deleteCalendarEventOperation(
                { Header: getJsonRequestHeader(), Body: body },
                getMailboxRequestOptions(getUserMailboxInfo())
            );

            window.removeEventListener('message', onCloseRemoveDraftItem);
        }
    }
}

// Determines if the given calendar event is a draft item
async function isDraftCalendarItem(calendarItemId: string) {
    const response = await getCalendarEventOperation({
        Header: getJsonRequestHeader(),
        Body: getCalendarEventRequest({
            EventIds: [itemId({ Id: calendarItemId })],
            ItemShape: { BaseShape: 'IdOnly' },
        }),
    });

    if (response?.Body?.ResponseMessages) {
        const responseMessage = response.Body.ResponseMessages.Items[0] as ItemInfoResponseMessage;

        if (responseMessage) {
            return responseMessage.Items?.[0]?.IsDraft;
        }
    }
    return false;
}

/**
 * Data logging for smart time
 * To help us to understand why user clicks on the meeting pill
 * but does not finish the scheduling workflow.
 */
function logUnsampledUsage(
    datapointName: string,
    featureName: string,
    extractionSourceId: string,
    startTimeInMillSec: number
) {
    const closeMeetingFullFormInMs: number = timestamp() - startTimeInMillSec;
    const customData: CustomData = [featureName];
    const cosmosOnlyData: string = JSON.stringify({
        EID: extractionSourceId,
        CloseFormInMs: closeMeetingFullFormInMs,
    });
    const datapoint = new UsageDatapoint(datapointName, customData, {
        isCore: true,
        excludeFromKusto: true,
    });

    datapoint.addCosmosOnlyData(cosmosOnlyData);

    lazyLogDatapoint.importAndExecute(datapoint);
}
