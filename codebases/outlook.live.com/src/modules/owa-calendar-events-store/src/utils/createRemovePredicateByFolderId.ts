import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';

/**
 * Generate a predicate that determines whether a given event should be removed, scoped by folderId and
 * based on whether the itemId has a match or not in the provided list of events to compare against
 */
export function createRemovePredicateByFolderId(
    folderId: string,
    eventsToCompare: CalendarEvent[],
    shouldRemoveIfMatch: boolean
) {
    return (event: CalendarEvent) => {
        if (!isValidEvent(event) || event.ParentFolderId.Id !== folderId) {
            return false;
        }
        const eventEqualityCheck = createEventEqualityPredicate(
            event.ParentFolderId.Id,
            event.ItemId.Id
        );
        return shouldRemoveIfMatch
            ? eventsToCompare.some(eventEqualityCheck)
            : !eventsToCompare.some(eventEqualityCheck);
    };
}

/**
 * Generates a predicate that determines whether a given event matches by folderId and itemId
 */
function createEventEqualityPredicate(folderId: string, itemId: string) {
    return (event: CalendarEvent) =>
        isValidEvent(event) && event.ParentFolderId.Id === folderId && event.ItemId.Id === itemId;
}

/**
 * Checks whether a given event has valid itemId and folderId values
 */
function isValidEvent(event: CalendarEvent) {
    return event?.ItemId?.Id && event.ParentFolderId && event.ParentFolderId.Id;
}
