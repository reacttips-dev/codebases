import type CalendarEvent from '../types/CalendarEvent';
import getDefaultRecurrenceStart from './getDefaultRecurrenceStart';

export default function initializeAsThisAndFollowingInstances(
    newMaster: CalendarEvent,
    existingInstance: CalendarEvent
) {
    // For editing this and following instances we need to make a hybrid item:
    // * Start/End times to match original instance's times
    // * ID to match instance ID
    // * CalendarItemType to be something special
    // * Recurrence start to instance's start
    newMaster.Start = existingInstance.Start;
    newMaster.ItemId = existingInstance.ItemId;
    newMaster.End = existingInstance.End;
    newMaster.CalendarItemType = 'ThisAndFollowingInstancesMaster';
    newMaster.Recurrence.RecurrenceRange.StartDate = getDefaultRecurrenceStart(existingInstance);
}
