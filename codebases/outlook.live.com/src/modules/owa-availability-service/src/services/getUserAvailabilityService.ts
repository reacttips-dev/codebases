import type FreeBusyViewType from 'owa-service/lib/contract/FreeBusyViewType';
import type GetUserAvailabilityInternalResponse from 'owa-service/lib/contract/GetUserAvailabilityInternalResponse';
import duration from 'owa-service/lib/factory/duration';
import emailAddress from 'owa-service/lib/factory/emailAddress';
import freeBusyViewOptions from 'owa-service/lib/factory/freeBusyViewOptions';
import getUserAvailabilityRequest from 'owa-service/lib/factory/getUserAvailabilityRequest';
import mailboxData from 'owa-service/lib/factory/mailboxData';
import getUserAvailabilityInternalOperation from 'owa-service/lib/operation/getUserAvailabilityInternalOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { logServiceCallForDiagnostics } from 'owa-calendar-forms-diagnostics';
// TODO VSO 113265: remove Mobx store dependent package dependencies from `owa-calendar-services` and `owa-availability-service`
import { isFeatureEnabled } from 'owa-feature-flags';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type { MailboxInfo } from 'owa-client-ids';

/**
 * Makes the GetUserAvailabilityInternal call to the server to get calendar items for linked calendar
 * @param {string} rangeStart start of request range
 * @param {string} rangeEnd end of request range
 * @param {string[]} emails smtp address array of request mailbox
 * @param {FreeBusyViewType} requestedView FreeBusyViewType requested
 * @param {string} timeZone The time zone
 * @param {MailboxInfo} mailboxInfo The Mailbox Info of the requesting user
 * @param {MergedFreeBusyIntervalInMinutes} mergedFreeBusyIntervalInMinutes If requesting MergedFreeBusy view, the interval of time for each value.
 * @returns promise of calendar items
 */
export async function getUserAvailabilityService(
    rangeStart: string,
    rangeEnd: string,
    emails: string[],
    requestedView: FreeBusyViewType,
    timeZone?: string,
    mailboxInfo?: MailboxInfo,
    mergedFreeBusyIntervalInMinutes?: number
): Promise<GetUserAvailabilityInternalResponse> {
    const header = getJsonRequestHeader();
    if (timeZone) {
        header.TimeZoneContext.TimeZoneDefinition.Id = timeZone;
    }
    let response;

    let options = null;
    if (mailboxInfo) {
        options = getMailboxRequestOptions(mailboxInfo);
    }

    try {
        response = await getUserAvailabilityInternalOperation(
            {
                request: {
                    Header: header,
                    Body: getUserAvailabilityRequest({
                        MailboxDataArray: emails.map(email =>
                            mailboxData({ Email: emailAddress({ Address: email }) })
                        ),
                        FreeBusyViewOptions: freeBusyViewOptions({
                            RequestedView: requestedView,
                            TimeWindow: duration({
                                StartTime: rangeStart,
                                EndTime: rangeEnd,
                            }),
                            MergedFreeBusyIntervalInMinutes: mergedFreeBusyIntervalInMinutes,
                        }),
                    }),
                },
            },
            options
        );
    } finally {
        if (isFeatureEnabled('cal-mf-diagnostics')) {
            logServiceCallForDiagnostics({
                action: 'GetUserAvailabilityInternal',
                status: response ? response.Body.ResponseCode : 'Error',
                response: response?.Body,
            });
        }
    }

    return response.Body;
}
