import type AttachmentWellHost from 'owa-calendar-meeting-forms-common-store/lib/store/schema/AttachmentWellHost';
import type { CalendarEvent } from 'owa-calendar-types';
import type { ClientItemId } from 'owa-client-ids';
import type EditorViewState from 'owa-editor/lib/store/schema/EditorViewState';
import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';
import type CollabSpaceViewState from 'owa-calendar-meeting-forms-common-store/lib/store/schema/CollabSpaceViewState';

export const enum ResponseEditorState {
    Closed,
    Expanded,
}

export enum CalendarCardPivot {
    Messages = 'Messages',
    MeetingDetails = 'MeetingDetails',
}

export enum CalendarCardContentWidth {
    Unset = 'Unset',
    Narrow = 'Narrow',
    Medium = 'Medium',
    Large = 'Large',
    Wide = 'Wide',
}

export interface CalendarCardViewState extends AttachmentWellHost, CollabSpaceViewState {
    /**
     * the id of the latest meeting mesage that used to populate calendar card, which can be
     * - meeting reuqest, or cancellation, or response(organizer receives RSVP for series exception)
     */
    latestMeetingMessageId: ClientItemId | null;
    latestRequestId: ClientItemId | null;
    latestCancellationId: ClientItemId | null;
    eventId: ClientItemId | null;
    event: CalendarEvent;
    removedFromCalendar: boolean;
    responseType: ResponseTypeType;
    responseEditorState: ResponseEditorState;
    emailOrganizer: boolean;
    editorViewState: EditorViewState;
    activePivot: CalendarCardPivot;
    contentWidth: CalendarCardContentWidth;
    unreadMessageCount: number;
    isSingleMeetingMessageConversation: boolean;
    attendeeResponseActionsExpanded: boolean;
    eventViewedLogged: boolean;
}
