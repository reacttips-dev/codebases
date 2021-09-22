import type { CalendarEvent } from 'owa-calendar-types';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function shouldOpenInCompose(item: CalendarEvent, isDoubleClick?: boolean): boolean {
    const isDraftOrUnsent = item.IsDraft || !item.MeetingRequestWasSent;
    const isDoubleClickAction = !!isDoubleClick && isFeatureEnabled('mon-cal-item-doubleclick');

    // For Monarch, double-click should always open organizer's meetings in compose.
    // For OWA and for single-click in Monarch, open organizer's meetings in compose if
    // this an existing or unsent draft of a new meeting.
    return !!(item.IsOrganizer && ((item.IsMeeting && isDraftOrUnsent) || isDoubleClickAction));
}
