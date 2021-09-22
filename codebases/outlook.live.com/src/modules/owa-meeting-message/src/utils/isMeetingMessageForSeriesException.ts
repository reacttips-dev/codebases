import type MeetingMessage from 'owa-service/lib/contract/MeetingMessage';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import type MeetingResponseMessageType from 'owa-service/lib/contract/MeetingResponseMessageType';
import type MeetingCancellationMessageType from 'owa-service/lib/contract/MeetingCancellationMessageType';

export default function isMeetingMessageForSeriesException(message: MeetingMessage): boolean {
    const meetingMessage = message as
        | MeetingRequestMessageType
        | MeetingResponseMessageType
        | MeetingCancellationMessageType;

    // CalendarItemType for the MeetingResponseMessage of occurrence is RecurringMaster, check RecurrenceId only
    return !!meetingMessage.RecurrenceId;
}
