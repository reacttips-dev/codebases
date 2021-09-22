import { eventDraftText, eventNoSubjectText } from './getCalendarEventItemText.locstring.json';
import type { CalendarEvent } from 'owa-calendar-types';
import loc from 'owa-localize';
import { getLocationDisplayWithAddressText } from 'owa-location-display-text';

export function getCalendarEventItemSubjectText(
    item: CalendarEvent,
    allowEmptySubject?: boolean
): string {
    const subjectParts = [];
    if (item.IsDraft) {
        // prepend "[Draft] for draft items
        subjectParts.push(loc(eventDraftText));
    }

    if (item.Subject) {
        // append the actual subject (if any)
        subjectParts.push(item.Subject);
    } else if (!allowEmptySubject) {
        // otherwise append "(No subject)" by default, unless override is specified
        subjectParts.push(loc(eventNoSubjectText));
    }

    // separate with a space if there are multiple parts
    return subjectParts.join(' ');
}

export function getCalendarEventItemLocationText(item: CalendarEvent): string {
    return item.Location
        ? getLocationDisplayWithAddressText(item.Location.DisplayName, item.Location.PostalAddress)
        : '';
}
