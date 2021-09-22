import { markCalendarEntryAsValid, updateCalendarEntry } from '../actions/publicActions';

import type { CalendarEntry } from 'owa-graph-schema';
import { getCalendarEntryByCalendarId } from '../selectors/calendarsCacheSelectors';
import getStore from '../store/store';
import { mutator } from 'satcheljs';

mutator(updateCalendarEntry, actionMessage => {
    const { id, calendarEntry } = actionMessage;

    const calendarEntryInStore: CalendarEntry = getCalendarEntryByCalendarId(id);
    const { calendarId, ...calendarEntryWithoutItemId } = calendarEntry;

    if (calendarEntryInStore) {
        Object.keys(calendarEntryWithoutItemId).forEach(property => {
            calendarEntryInStore[property] = calendarEntryWithoutItemId[property];
        });
    }
});

mutator(markCalendarEntryAsValid, actionMessage => {
    const { calendarEntry } = actionMessage;
    const store = getStore();

    store.validEntryMapping.set(calendarEntry.calendarId.id, true);
});
