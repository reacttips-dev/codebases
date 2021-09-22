import type { CalendarEvent } from 'owa-calendar-types';
import canModify from './canModify';
import { isEventAMeeting } from '../index';

/**
 * Determines if the delete button is to be shown for organizer
 * @param item Subject item
 */
export default (item: CalendarEvent): boolean => {
    return !!(
        item.IsOrganizer &&
        (!isEventAMeeting(item) || !item.MeetingRequestWasSent) &&
        canModify(item)
    );
};
