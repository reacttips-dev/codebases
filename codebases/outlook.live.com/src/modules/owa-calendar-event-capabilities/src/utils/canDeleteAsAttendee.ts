import type { CalendarEvent } from 'owa-calendar-types';
import { isMeetingAttendee } from '../index';
import canModify from './canModify';
/**
 * Determines if the delete button is to be shown for attendee
 * @param item Subject item
 */
export default (item: CalendarEvent): boolean =>
    isMeetingAttendee(item) && canModify(item) && !item.IsCancelled; // for cancelled event do not show
