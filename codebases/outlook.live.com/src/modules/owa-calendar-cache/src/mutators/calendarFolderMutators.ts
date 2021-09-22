import { getCalendarEntryByCalendarId } from '../selectors/calendarsCacheSelectors';
import { mutator } from 'satcheljs';
import { updateCalendarFolder } from '../actions/publicActions';

mutator(updateCalendarFolder, actionMessage => {
    const { calendar, calendarFolder } = actionMessage;

    const calendarEntryInStore = getCalendarEntryByCalendarId(calendar.calendarId.id);

    Object.keys(calendarFolder).forEach(property => {
        calendarEntryInStore[property] = calendarFolder[property];
    });
});
