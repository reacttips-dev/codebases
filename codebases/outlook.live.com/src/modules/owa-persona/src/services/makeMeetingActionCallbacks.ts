import type {
    EditMeetingParams,
    JoinOnlineMeetingParams,
    MeetingActionCallbacks,
    MeetingResponseActionListener,
    PersonaConfig,
} from '../personaConfig';
import {
    editMeeting,
    joinOnlineMeeting,
    onAcceptingMeeting,
    onCancelingMeeting,
    onDecliningMeeting,
    onDeletingMeeting,
    onMeetingResponseActionFailed,
    onMeetingResponseActionSucceeded,
    onTentativelyAcceptingMeeting,
} from '../actions/meetingCardActions';

export default function makeMeetingActionCallbacks(config: PersonaConfig): MeetingActionCallbacks {
    return {
        onAcceptingMeeting: propagateOnAcceptingMeeting,
        onTentativelyAcceptingMeeting: propagateOnTentativelyAcceptingMeeting,
        onDecliningMeeting: propagateOnDecliningMeeting,
        onCancelingMeeting: propagateOnCancelingMeeting,
        onDeletingMeeting: propagateOnDeletingMeeting,
        joinOnlineMeeting: propagateJoinOnlineMeeting,
        editMeeting: propagateEditMeeting,
    };
}

function propagateOnAcceptingMeeting(
    meetingId: string,
    respondToSeries: boolean
): MeetingResponseActionListener {
    onAcceptingMeeting(meetingId, respondToSeries);

    return {
        onSuccess: onMeetingResponseActionSucceeded,
        onFailure: onMeetingResponseActionFailed,
    };
}

function propagateOnTentativelyAcceptingMeeting(meetingId: string, respondToSeries: boolean) {
    onTentativelyAcceptingMeeting(meetingId, respondToSeries);

    return {
        onSuccess: onMeetingResponseActionSucceeded,
        onFailure: onMeetingResponseActionFailed,
    };
}

function propagateOnDecliningMeeting(meetingId: string, respondToSeries: boolean) {
    onDecliningMeeting(meetingId, respondToSeries);

    return {
        onSuccess: onMeetingResponseActionSucceeded,
        onFailure: onMeetingResponseActionFailed,
    };
}

function propagateOnCancelingMeeting(meetingId: string, respondToSeries: boolean) {
    onCancelingMeeting(meetingId, respondToSeries);

    return {
        onSuccess: onMeetingResponseActionSucceeded,
        onFailure: onMeetingResponseActionFailed,
    };
}

function propagateOnDeletingMeeting(meetingId: string, respondToSeries: boolean) {
    onDeletingMeeting(meetingId, respondToSeries);

    return {
        onSuccess: onMeetingResponseActionSucceeded,
        onFailure: onMeetingResponseActionFailed,
    };
}

function propagateJoinOnlineMeeting(
    meetingId: string,
    joinOnlineMeetingParams: JoinOnlineMeetingParams
) {
    joinOnlineMeeting(meetingId, joinOnlineMeetingParams);
}

function propagateEditMeeting(meetingId: string, editMeetingParams: EditMeetingParams) {
    editMeeting(meetingId, editMeetingParams);
}
