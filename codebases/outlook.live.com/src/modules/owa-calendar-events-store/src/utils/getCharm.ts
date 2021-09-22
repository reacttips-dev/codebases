import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { getCalendarCharmIdByFolderId } from '../index';

export function getCharm(item: CalendarEvent): number {
    let charmId = item?.CharmId;
    return charmId || getCalendarCharmIdByFolderId(item.ParentFolderId.Id);
}
