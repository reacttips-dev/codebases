import {
    CalendarCardViewState,
    ResponseEditorState,
    CalendarCardPivot,
    CalendarCardContentWidth,
} from '../store/schema/CalendarCardViewState';

export default function getInitialViewState(): CalendarCardViewState {
    return {
        latestMeetingMessageId: null,
        latestRequestId: null,
        latestCancellationId: null,
        eventId: null,
        event: null,
        removedFromCalendar: false,
        responseType: 'Unknown',
        responseEditorState: ResponseEditorState.Closed,
        emailOrganizer: true,
        editorViewState: null,
        activePivot: CalendarCardPivot.Messages,
        attachmentWell: null,
        contentWidth: CalendarCardContentWidth.Unset,
        unreadMessageCount: 0,
        isSingleMeetingMessageConversation: false,
        attendeeResponseActionsExpanded: false,
        eventViewedLogged: false,
    } as CalendarCardViewState;
}
