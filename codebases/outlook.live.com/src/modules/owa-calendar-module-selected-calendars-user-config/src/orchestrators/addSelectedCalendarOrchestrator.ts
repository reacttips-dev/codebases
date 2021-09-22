import { orchestrator } from 'satcheljs';
import { addSelectedCalendar, selectedCalendarsUpdated } from '../actions/publicActions';
import { addSelectedCalendarInStore } from '../actions/internalActions';
import { getSelectedCalendarsForUser } from '../selectors/getSelectedCalendarsForUser';
import { updateSelectedCalendarsState } from '../services/updateSelectedCalendarsState';

orchestrator(addSelectedCalendar, actionMessage => {
    const { calendarId, userIdentity } = actionMessage;
    addSelectedCalendarInStore(calendarId, userIdentity);
    const updatedCalendars = getSelectedCalendarsForUser(userIdentity);
    selectedCalendarsUpdated(updatedCalendars, userIdentity);
    updateSelectedCalendarsState(updatedCalendars, userIdentity);
});
