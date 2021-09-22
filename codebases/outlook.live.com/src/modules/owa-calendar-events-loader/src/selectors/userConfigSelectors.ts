import type { EventsCacheLockId } from 'owa-calendar-events-store';
import { shouldShowDeclinedEvents } from 'owa-show-declined-meetings-user-config';

/**
 * TODO VSO 51643: Add Time Panel setting for showing declined meetings.
 * Currently in this package we respect the calendar module setting. Consumers
 * can do additional filtering of declined meetings if needed (e.g. TimePanel always filters declined events out).
 * When we add the Time Panel setting for showing declined meetings, we should consider updating this package to
 * support per-consumer control of the declined meetings setting within this package (similar to how we support selected calendars).
 */
export function getShowDeclinedMeetingsEnabled(eventsCacheLockId: EventsCacheLockId): boolean {
    // respects the Calendar module setting (behind feature flag)
    return shouldShowDeclinedEvents();
}
