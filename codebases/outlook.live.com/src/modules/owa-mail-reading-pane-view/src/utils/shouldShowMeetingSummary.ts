import type { CalendarCardViewState } from 'owa-mail-calendar-card';
import { ExtendedCardType } from 'owa-mail-reading-pane-store/lib/store/schema/ExtendedCardViewState';
import getConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/utils/getConversationReadingPaneViewState';
import { isSingleItemPartMeetingRequest } from 'owa-mail-reading-pane-store/lib/utils/tryInitializeCalendarCard';
import { isMeetingCancellation, isMeetingRequest } from 'owa-meeting-message';
import type MeetingMessage from 'owa-service/lib/contract/MeetingMessage';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import {
    hasExtendedCard,
    getExtendedCardViewState,
} from 'owa-mail-reading-pane-store/lib/utils/extendedCardUtils';

export function shouldShowMeetingSummary(message: MeetingMessage, isPopout: boolean): boolean {
    const viewState = getConversationReadingPaneViewState(message.ConversationId.Id);
    if (!viewState) {
        return false;
    }

    if (isSingleItemPartMeetingRequest(viewState)) {
        // Hide summary when conversation contains only one meeting request to avoid information duplication
        return false;
    }

    return shouldShowMeetingCardFeedView(message, isPopout);
}

export function shouldShowMeetingCardFeedView(message: MeetingMessage, isPopout: boolean): boolean {
    const viewState = getConversationReadingPaneViewState(message.ConversationId.Id);
    if (!viewState) {
        return false;
    }

    if (isPopout) {
        // Fall back to old UI for popout
        return false;
    }
    if (!hasExtendedCard(viewState, ExtendedCardType.CalendarCard)) {
        return false;
    }

    const calendarItemId = (getExtendedCardViewState(
        viewState,
        ExtendedCardType.CalendarCard
    ) as CalendarCardViewState).eventId;

    if (!calendarItemId) {
        // Never summarize if we don't have a Calendar Card
        return false;
    }

    if (
        message.AssociatedCalendarItemId &&
        calendarItemId.Id === message.AssociatedCalendarItemId.Id
    ) {
        // If the id matches the Calendar Card, always summarize
        return true;
    }

    if (isMeetingRequest(message.ItemClass)) {
        // If the id does not match the Calendar Card, then this is for Series Instances & Exceptions.
        // Summarize everything but critical updates.
        const meetingRequest = message as MeetingRequestMessageType;
        return (
            meetingRequest.MeetingRequestType !== 'NewMeetingRequest' &&
            meetingRequest.MeetingRequestType !== 'FullUpdate'
        );
    }

    if (isMeetingCancellation(message.ItemClass)) {
        // Don't summarize cancellations, so that the user can remove them from their calendar
        return false;
    }

    // Summarize Instance Responses as those have no request for action
    return true;
}
