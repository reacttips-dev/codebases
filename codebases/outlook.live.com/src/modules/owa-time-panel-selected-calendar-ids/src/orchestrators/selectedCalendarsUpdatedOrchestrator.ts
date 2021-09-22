import { onSelectedCalendarIdsUpdated } from '../actions/publicActions';
import { hasTimePanelSelectedCalendars } from '../selectors/hasTimePanelSelectedCalendars';
import { selectedCalendarsUpdated } from 'owa-calendar-module-selected-calendars-user-config';
import { orchestrator } from 'satcheljs';

/**
 * Keep package consumers in-sync with left-nav selection changes in Calendar module
 * until the user has set custom selected calendars in Time Panel
 */
export const selectedCalendarsUpdatedOrchestrator = orchestrator(selectedCalendarsUpdated, () => {
    if (!hasTimePanelSelectedCalendars()) {
        onSelectedCalendarIdsUpdated();
    }
});
