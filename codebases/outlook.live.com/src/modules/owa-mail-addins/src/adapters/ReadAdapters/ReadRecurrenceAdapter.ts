import loadCalendarItem from '../../services/loadCalendarItem';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';

export const getRecurrence = (event: MeetingRequestMessageType) => async () => {
    if (!event.AssociatedCalendarItemId) {
        return null;
    }
    if (event.Recurrence) {
        return event.Recurrence;
    } else {
        const associatedEvent = await loadCalendarItem(event.AssociatedCalendarItemId);
        // In the case that the associated event has been removed from the calendar, the meeting request will still have
        // the eventId, but the event will not be found by loadCalendarItem.
        if (!associatedEvent) {
            return null;
        }
        if (associatedEvent.Recurrence) {
            return associatedEvent.Recurrence;
        }
        if (associatedEvent.SeriesMasterItemId) {
            const masterEvent = await loadCalendarItem(associatedEvent.SeriesMasterItemId);
            if (!masterEvent) {
                return null;
            }
            return masterEvent.Recurrence;
        }
        return null;
    }
};

export function getSeriesId(event: MeetingRequestMessageType): () => Promise<string> {
    if (!event || !event.IsRecurring) {
        return () => Promise.resolve(undefined);
    }
    return async () => {
        const associatedEvent = await loadCalendarItem(event.AssociatedCalendarItemId);
        if (associatedEvent?.SeriesMasterItemId) {
            return associatedEvent.SeriesMasterItemId.Id;
        }
        return null;
    };
}
