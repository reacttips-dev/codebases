import type CalendarEvent from '../types/CalendarEvent';
import { getTimestamp } from 'owa-datetime';

/** Returns true if two calendar events overlap. */
export default (a: CalendarEvent, b: CalendarEvent) =>
    getTimestamp(a.Start) < getTimestamp(b.End) && getTimestamp(a.End) > getTimestamp(b.Start);
