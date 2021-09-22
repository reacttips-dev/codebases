import { addSelectedCalendarInStore } from '../actions/internalActions';
import { getSelectedCalendarsForUser } from '../selectors/getSelectedCalendarsForUser';
import { selectedCalendarsStore } from '../store/store';
import { dedupeArrayValues } from 'owa-selected-calendars-utils';
import { mutator } from 'satcheljs';

mutator(addSelectedCalendarInStore, actionMessage => {
    const { calendarId, userIdentity } = actionMessage;
    selectedCalendarsStore().selectedCalendars.set(
        userIdentity,
        dedupeArrayValues([...getSelectedCalendarsForUser(userIdentity), calendarId])
    );
});
