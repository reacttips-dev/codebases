import { differenceInDays } from 'owa-datetime';
import type CalendarEvent from '../types/CalendarEvent';

/** Returns true if the given event should be rendered as an all day event. */
export default (event: CalendarEvent) =>
    event.IsAllDayEvent || differenceInDays(event.End, event.Start) > 0;
