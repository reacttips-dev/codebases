import { orchestrator } from 'satcheljs';
import {
    calendarEventsAdded,
    calendarEventsRemoved,
    calendarEventUpdated,
} from 'owa-calendar-events-store';
import { refreshUpNextCalendarEventForAllScenarios } from '../utils/refreshUpNextCalendarEventForAllScenarios';

// Manually refresh the up-next calendar event outside of poll interval
// for more timely updates in response to calendar event notifications

export const calendarEventsAddedOrchestrator = orchestrator(calendarEventsAdded, () => {
    refreshUpNextCalendarEventForAllScenarios();
});

export const calendarEventsRemovedOrchestrator = orchestrator(calendarEventsRemoved, () => {
    refreshUpNextCalendarEventForAllScenarios();
});

export const calendarEventUpdatedOrchestrator = orchestrator(calendarEventUpdated, () => {
    refreshUpNextCalendarEventForAllScenarios();
});
