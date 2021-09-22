import { updateSelectedCalendarsInStore } from '../actions/internalActions';
import { selectedCalendarsStore } from '../store/store';
import { dedupeArrayValues } from 'owa-selected-calendars-utils';
import { mutator } from 'satcheljs';

mutator(updateSelectedCalendarsInStore, actionMessage => {
    const { calendarIds, userIdentity } = actionMessage;
    selectedCalendarsStore().selectedCalendars.set(userIdentity, dedupeArrayValues(calendarIds));
});
