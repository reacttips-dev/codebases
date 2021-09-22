import { isStringNullOrWhiteSpace } from 'owa-localize';
import type { ClientMessage } from 'owa-mail-store';
import { isMeetingCancellation, isMeetingRequest, isMeetingResponse } from 'owa-meeting-message';
import type MeetingCancellationMessageType from 'owa-service/lib/contract/MeetingCancellationMessageType';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import type MeetingResponseMessageType from 'owa-service/lib/contract/MeetingResponseMessageType';

export default function shouldShowCollapsedMeetingMessage(item: ClientMessage): boolean {
    if (
        isMeetingRequest(item.ItemClass) &&
        isStringNullOrWhiteSpace(item.Preview) &&
        !(item as MeetingRequestMessageType).RecurrenceId
    ) {
        return true;
    } else if (isMeetingResponse(item.ItemClass)) {
        const message = item as MeetingResponseMessageType;

        if (
            isStringNullOrWhiteSpace(message.Preview) &&
            !(message.ProposedStart && message.ProposedEnd)
        ) {
            return true;
        }
    } else if (isMeetingCancellation(item.ItemClass)) {
        const cancellation = item as MeetingCancellationMessageType;

        // RecurrenceId indicates Series Instance or Exception.
        return isStringNullOrWhiteSpace(cancellation.Preview) && !cancellation.RecurrenceId;
    }

    return false;
}
