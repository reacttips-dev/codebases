import getGroupCalendarsService from '../services/getGroupCalendarsService';
import { addToCalendarsCache, addCalendarGroupToCalendarsCache } from 'owa-calendar-cache';
import { deDupeGroupCalendars } from './deDupeGroupCalendars';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import type { CalendarGroup } from 'owa-graph-schema';

export interface GroupCalendars {
    group: CalendarGroup;
}

export async function getGroupCalendars(userIdentity: string): Promise<GroupCalendars> {
    const result = await getGroupCalendarsService(userIdentity);
    const groupCalendarsResult = isConsumer(userIdentity) ? deDupeGroupCalendars(result) : result;

    // add the calendar entries and groups to the cache mappings to keep them up to date
    if (groupCalendarsResult != null && groupCalendarsResult.groupCalendars != null) {
        groupCalendarsResult.groupCalendars.forEach(groupCalendar => {
            addToCalendarsCache(groupCalendar.entry);
        });

        addCalendarGroupToCalendarsCache(groupCalendarsResult.calendarGroup);

        return {
            group: groupCalendarsResult.calendarGroup,
        };
    } else {
        return null;
    }
}
