import { orchestrator } from 'satcheljs';
import { updateSelectedCalendars, selectedCalendarsUpdated } from '../actions/publicActions';
import { updateSelectedCalendarsInStore } from '../actions/internalActions';
import { updateSelectedCalendarsState } from '../services/updateSelectedCalendarsState';

orchestrator(updateSelectedCalendars, actionMessage => {
    const { calendarIds, userIdentity } = actionMessage;
    updateSelectedCalendarsInStore(calendarIds, userIdentity);
    selectedCalendarsUpdated(calendarIds, userIdentity);
    updateSelectedCalendarsState(calendarIds, userIdentity);
});
