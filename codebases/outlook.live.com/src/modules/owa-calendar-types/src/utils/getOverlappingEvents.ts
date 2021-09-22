import type CalendarEvent from '../types/CalendarEvent';
import compareCalendarEvents from './compareCalendarEvents';
import overlap from './overlap';

/** Given a calendar event and a list of events, returns the events that overlap with the original event. */
export default (event: CalendarEvent, events: CalendarEvent[]) =>
    events.filter(e => e != event && overlap(event, e)).sort(compareCalendarEvents);
