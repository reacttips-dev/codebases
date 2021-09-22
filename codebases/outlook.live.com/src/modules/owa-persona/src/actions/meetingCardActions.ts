import { action } from 'satcheljs';
import type {
    EditMeetingParams,
    JoinOnlineMeetingParams,
    PersonaIdentifiers,
    MeetingResponseActionParams,
} from '../personaConfig';

/**
 * Action fired when a meeting is about to be accepted in the MeetingCard
 * @param meetingId Meeting ID
 * @param respondToSeries True if the action applies to a meeting series, False if only to an occurrence
 */
export const onAcceptingMeeting = action(
    'onAcceptingMeeting',
    (meetingId: string, respondToSeries: boolean) => ({
        meetingId,
        respondToSeries,
    })
);

/**
 * Action for when a meeting is about to be tentatively accepted in the MeetingCard
 * @param meetingId Meeting ID
 * @param respondToSeries True if the action applies to a meeting series, False if only to an occurrence
 */
export const onTentativelyAcceptingMeeting = action(
    'onTentativelyAcceptingMeeting',
    (meetingId: string, respondToSeries: boolean) => ({
        meetingId,
        respondToSeries,
    })
);

/**
 * Action for when a meeting is about to be declined in the MeetingCard
 * @param meetingId Meeting ID
 * @param respondToSeries True if the action applies to a meeting series, False if only to an occurrence
 */
export const onDecliningMeeting = action(
    'onDecliningMeeting',
    (meetingId: string, respondToSeries: boolean) => ({
        meetingId,
        respondToSeries,
    })
);

/**
 * Action for when a meeting is about to be canceled in the MeetingCard
 * @param meetingId Meeting ID
 * @param respondToSeries True if the action applies to a meeting series, False if only to an occurrence
 */
export const onCancelingMeeting = action(
    'onCancelingMeeting',
    (meetingId: string, respondToSeries: boolean) => ({
        meetingId,
        respondToSeries,
    })
);

/**
 * Action for when a meeting is about to be deleted in the MeetingCard
 * @param meetingId Meeting ID
 * @param respondToSeries True if the action applies to a meeting series, False if only to an occurrence
 */
export const onDeletingMeeting = action(
    'onDeletingMeeting',
    (meetingId: string, respondToSeries: boolean) => ({
        meetingId,
        respondToSeries,
    })
);

/**
 * Action for when a meeting response action failed
 * @param meetingId Meeting ID
 * @param originalMeetingResponse The response status of the meeting before the action that failed was attempted.
 * @param error Error message
 * @param meetingResponseActionParams Parameters for response action used for logging purposes
 */
export const onMeetingResponseActionFailed = action(
    'onMeetingResponseActionFailed',
    (
        meetingId: string,
        originalMeetingResponse: string,
        error?: string,
        meetingResponseActionParams?: MeetingResponseActionParams
    ) => ({
        meetingId,
        originalMeetingResponse,
        error,
        meetingResponseActionParams,
    })
);

/**
 * Action for when a meeting response action succeeded
 * @param meetingId Meeting ID
 * @param originalMeetingResponse The original response status of the meeting that has succeeded.
 * @param meetingResponseActionParams Parameters for response action used for logging purposes
 */
export const onMeetingResponseActionSucceeded = action(
    'onMeetingResponseActionSucceeded',
    (
        meetingId: string,
        originalMeetingResponse: string,
        meetingResponseActionParams?: MeetingResponseActionParams
    ) => ({
        meetingId,
        originalMeetingResponse,
        meetingResponseActionParams,
    })
);

/**
 * Action for when an online meeting is being joined
 * @param meetingId Meeting ID
 * @param joinOnlineMeetingParams Parameters for the join online operation
 */
export const joinOnlineMeeting = action(
    'joinOnlineMeeting',
    (meetingId: string, joinOnlineMeetingParams: JoinOnlineMeetingParams) => ({
        meetingId,
        joinOnlineMeetingParams,
    })
);

/**
 * Action for when a meeting being edited
 * @param meetingId Meeting ID
 * @param editMeetingParams Parameters for the edit operation
 */
export const editMeeting = action(
    'editMeeting',
    (meetingId: string, editMeetingParams: EditMeetingParams) => ({
        meetingId,
        editMeetingParams,
    })
);

/**
 * Action for when the MeetingCard requests the local meeting data before the call to Loki returns
 * @param personaId the persona identifiers for the meeting. PersonaType will be "Meeting"
 * @param successCallback the callback to return the meeting's local data once it's obtained
 */
export const onMeetingInfoRequested = action(
    'onMeetingInfoRequested',
    (
        personaId: PersonaIdentifiers,
        successCallback: (persona: any, errorMessage: string) => void
    ) => ({
        personaId,
        successCallback,
    })
);

/**
 * Action for when the user wants to open a meeting from the Meeting Card
 * @param meetingId Meeting ID
 */
export const openMeeting = action('openMeeting', (meetingId: string) => ({
    meetingId,
}));
