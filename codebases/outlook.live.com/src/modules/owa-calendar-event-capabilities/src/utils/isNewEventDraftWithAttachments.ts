import type { CalendarEvent } from 'owa-calendar-types';
import isSavedMeetingDraft from './isSavedMeetingDraft';

export default function isNewEventDraftWithAttachments(item: CalendarEvent): boolean {
    // Check that the event has ItemId (draft with attachment scenario) and that it's not an already saved draft.
    return !!(item.ItemId && item.IsDraft) && !isSavedMeetingDraft(item);
}
