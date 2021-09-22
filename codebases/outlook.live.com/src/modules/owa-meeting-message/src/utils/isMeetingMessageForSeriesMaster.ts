import type MeetingMessage from 'owa-service/lib/contract/MeetingMessage';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import type MeetingResponseMessageType from 'owa-service/lib/contract/MeetingResponseMessageType';
import type MeetingCancellationMessageType from 'owa-service/lib/contract/MeetingCancellationMessageType';

export default function isMeetingMessageForSeriesMaster(message: MeetingMessage): boolean {
    const meetingMessage = message as
        | MeetingRequestMessageType
        | MeetingResponseMessageType
        | MeetingCancellationMessageType;

    // CalendarItemType for the MeetingResponseMessage of occurrence is also RecurringMaster, check RecurrenceId as well
    return meetingMessage.CalendarItemType === 'RecurringMaster' && !meetingMessage.RecurrenceId;
}
