import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import bodyContentType from 'owa-service/lib/factory/bodyContentType';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import respondToCalendarEventOperation from 'owa-service/lib/operation/respondToCalendarEventOperation';
import respondToCalendarEventRequest from 'owa-service/lib/factory/respondToCalendarEventRequest';
import type RespondToCalendarEventResponse from 'owa-service/lib/contract/RespondToCalendarEventResponse';
import respondToCalendarEventResponse from 'owa-service/lib/factory/respondToCalendarEventResponse';
import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type { MailboxInfo } from 'owa-client-ids';
import { logServiceCallForDiagnostics } from 'owa-calendar-forms-diagnostics';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getApolloClient } from 'owa-apollo';
import { RespondToMeetingInviteDocument } from '../graphql/__generated__/RespondToMeetingInviteMutation.interface';
import type ItemId from 'owa-service/lib/contract/ItemId';

export default async function respondToCalendarEventService(
    seriesOrSingleId: BaseItemId,
    mailboxInfo: MailboxInfo,
    response: ResponseTypeType,
    sendResponse: boolean,
    responseMessage: string = '',
    proposedStartTime: string = '',
    proposedEndTime: string = '',
    meetingMessageId: string = ''
): Promise<RespondToCalendarEventResponse> {
    if (isFeatureEnabled('mon-cal-apolloRequests') && !proposedStartTime && !proposedEndTime) {
        const client = getApolloClient();
        const result = await client.mutate({
            variables: {
                meetingId: seriesOrSingleId as ItemId,
                responseBody: responseMessage,
                responseType: response,
                shouldSendResponse: sendResponse,
                MeetingRequestIdToBeDeleted: meetingMessageId,
                mailboxInfo: mailboxInfo,
            },
            mutation: RespondToMeetingInviteDocument,
        });
        return respondToCalendarEventResponse({
            ResponseClass: result.data.respondToMeetingInvite.success ? 'Success' : 'Error',
            ResponseCode: result.data.respondToMeetingInvite.success ? 'NoError' : 'Error',
        });
    } else {
        const request = {
            Header: getJsonRequestHeader(),
            Body: respondToCalendarEventRequest({
                EventId: seriesOrSingleId,
                Response: response,
                SendResponse: sendResponse,
                Notes: bodyContentType({
                    BodyType: 'HTML',
                    Value: responseMessage,
                }),
                ProposedStartTime: proposedStartTime,
                ProposedEndTime: proposedEndTime,
                MeetingRequestIdToBeDeleted: meetingMessageId,
            }),
        };
        let serverResponse;

        try {
            serverResponse = await respondToCalendarEventOperation(
                request,
                getMailboxRequestOptions(mailboxInfo)
            );
        } finally {
            // Log the service call for forms diagnostics panel
            if (isFeatureEnabled('cal-mf-diagnostics')) {
                logServiceCallForDiagnostics({
                    action: 'RespondToCalendarEvent',
                    status: serverResponse ? serverResponse.Body.ResponseCode : 'Error',
                    response: serverResponse?.Body,
                    request: request,
                });
            }
        }

        return serverResponse?.Body;
    }
}
