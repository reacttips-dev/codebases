import { OwaDate, getEwsRequestString } from 'owa-datetime';
import type { MailboxInfo } from 'owa-client-ids';
import { getUserAvailabilityService } from '../services/getUserAvailabilityService';
import type UserAvailabilityCalendarView from 'owa-service/lib/contract/UserAvailabilityCalendarView';
import { PerformanceDatapoint } from 'owa-analytics/lib/datapoints/PerformanceDatapoint';
import { trace } from 'owa-trace';
import { DatapointStatus } from 'owa-analytics/lib/types/DatapointEnums';
import { createRequestQueue } from 'owa-service-utils';

const REQUEST_QUEUE = createRequestQueue(4);
/**
 * Interface for the response of pageQueryFunction.
 */
export interface PageQueryResponse {
    [address: string]: UserAvailabilityCalendarView;
}

const getEmptyUserAvailabilityCalendarViews = (attendees: string[]) => {
    let pageQueryResponse: PageQueryResponse = {};
    attendees.forEach(attendee => (pageQueryResponse[attendee] = { FreeBusyViewType: 'None' }));

    return pageQueryResponse;
};

/**
 * Function that retrieves a page of information for Free Busy Cache
 * @param {OwaDate} start The start time of the page
 * @param {OwaDate} end The end time of the page
 * @param {string[]} attendees The SMTP addresses to retrieve availability for.
 * @param {(PageQueryResponse) => void} processPageQueryResponse Callback to process query responses
 * @param {boolean} retryOnFail Whether a second retry should be attempted on fail, defaults to true
 * @param {MailboxInfo} mailboxInfo The Mailbox Info of the requesting user
 * @param {MergedFreeBusyIntervalInMinutes} mergedFreeBusyIntervalInMinutes If requesting MergedFreeBusy view, the interval of time for each value.
 */
export async function getAvailabilityFunction(
    start: OwaDate,
    end: OwaDate,
    attendees: string[],
    processPageQueryResponse: (response: PageQueryResponse) => void,
    retryOnFail: boolean = true,
    mailboxInfo?: MailboxInfo,
    mergedFreeBusyIntervalInMinutes?: number
) {
    if (attendees.length === 0) {
        return;
    }

    const datapoint = new PerformanceDatapoint('FreeBusyAvailabilityRequested', { isCore: true });
    datapoint.addCustomData({ numAttendees: attendees.length });

    try {
        const response = await REQUEST_QUEUE.add(() =>
            getUserAvailabilityService(
                getEwsRequestString(start),
                getEwsRequestString(end),
                attendees,
                'DetailedMerged',
                start.tz,
                mailboxInfo,
                mergedFreeBusyIntervalInMinutes
            )
        );
        datapoint.addCustomData({
            executingRequests: REQUEST_QUEUE.getRunningCount(),
            queuedRequests: REQUEST_QUEUE.getQueueLength(),
        });

        datapoint.end();

        const gotMatchingResponses: boolean =
            response.ResponseClass === 'Success' && attendees.length === response.Responses.length;
        let pageQueryResponse: PageQueryResponse = {};

        // Server doesn't include attendee smtp in the response. Based on contract, client assumes that the attendees and response.Responses arrays should be in the same order.
        // Therefore, we make sure the lengthes are the same before processing it.
        if (gotMatchingResponses) {
            attendees.forEach((attendee: string, index: number) => {
                pageQueryResponse[attendee] = response.Responses[index].CalendarView;
            });
        } else {
            pageQueryResponse = getEmptyUserAvailabilityCalendarViews(attendees);
        }

        if (retryOnFail) {
            // We need to filter the attendees with FreeBusyViewType 'None' and retry on those. Even if the service call succeeds,
            // some of the attendees in a batch could still fail because of cross-forest calls timeout very often.
            const attendeesToRetry = gotMatchingResponses
                ? Object.keys(pageQueryResponse).filter(
                      attendee => pageQueryResponse[attendee].FreeBusyViewType == 'None'
                  )
                : attendees;

            if (attendeesToRetry.length > 0) {
                getAvailabilityFunction(
                    start,
                    end,
                    attendeesToRetry,
                    processPageQueryResponse,
                    false /* retryOnFail */,
                    mailboxInfo,
                    mergedFreeBusyIntervalInMinutes
                );
            }
        }

        processPageQueryResponse(pageQueryResponse);
    } catch (error) {
        // Calls can be retried on error.
        datapoint.endWithError(DatapointStatus.ServerError, error);

        trace.warn(
            `[getAvailabilityFunction] Received error calling getUserAvailabilityService, Error: "${error.stack}"`
        );

        if (retryOnFail) {
            // Retry 1 time the batch that just failed, it won't retry again (retryOnFail is false), pass the original callback to resolve results.
            getAvailabilityFunction(
                start,
                end,
                attendees,
                processPageQueryResponse,
                false /* retryOnFail */,
                mailboxInfo,
                mergedFreeBusyIntervalInMinutes
            );
        } else {
            // Craft a response where all attendees have no FB, resolve callback with it
            const response = getEmptyUserAvailabilityCalendarViews(attendees);
            processPageQueryResponse(response);
        }
    }
}
