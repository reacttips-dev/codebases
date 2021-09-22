import type { CalendarEvent } from 'owa-calendar-types';

/**
 * If true, this calendar event exposes full details for viewing by the current user.
 * Otherwise only freebusy status is visible.
 */
export default function hasReadRights(item: CalendarEvent): boolean {
    return !!item.EffectiveRights?.Read;
}
