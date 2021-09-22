import {
    removeCalendarEventsFromEventsCacheMatchingFilter,
    upsertCalendarEventsToEventsCache,
} from '../actions/eventsCacheActions';
import {
    CalendarEventOperationResult,
    instantCalendarEventDelete,
    calendarEventsAdded,
} from '../actions/publicActions';
import { getCalendarEventWithId } from '../selectors/calendarFolderEventsSelectors';
import { isEventsCacheInitialized } from '../selectors/eventsCacheSelectors';
import getItemIdToUpdate from '../utils/getItemIdToUpdate';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { isBefore } from 'owa-datetime';
import EventScope from 'owa-service/lib/contract/EventScope';
import { orchestrator } from 'satcheljs';

orchestrator(instantCalendarEventDelete, async actionMessage => {
    const {
        eventId,
        eventScope,
        dataPoint,
        actionToExecute,
        onEventDeleteSuccess,
        onEventDeleteFailed,
        responseSent,
        actionSource,
        errorMessage,
        asyncUndoAction,
    } = actionMessage;

    const eventToDelete = getCalendarEventWithId(eventId.Id);
    let allowLocalDelete = isInstantDeleteSupported(eventToDelete);
    const deletedEvents = onDeleteItemStart(eventToDelete, eventScope, allowLocalDelete);

    if (dataPoint) {
        dataPoint.markUserPerceivedTime(); // mark user perceived time as soon as local lie is done
    }

    // Execute the operation
    let idToDelete = getItemIdToUpdate(eventId.Id, eventScope);
    let actionResult: CalendarEventOperationResult = null;

    try {
        // this notification gives the user a chance to cancel their action before actually sending to the server
        // if shouldUndo returns true, we return back without calling actionToExecute
        let shouldUndo = await asyncUndoAction(eventToDelete, responseSent, actionSource);

        if (shouldUndo) {
            undoDelete(deletedEvents, eventToDelete.ParentFolderId.Id, allowLocalDelete);
            return;
        }
        actionResult = await actionToExecute(idToDelete);

        if (!actionResult.isSuccessful) {
            throw new Error(errorMessage);
        }
    } catch (error) {
        undoDelete(deletedEvents, eventToDelete.ParentFolderId.Id, allowLocalDelete);
        let retryFunction = () =>
            instantCalendarEventDelete(
                eventId,
                eventScope,
                null,
                actionToExecute,
                onEventDeleteSuccess,
                () => onEventDeleteFailed(error, null, actionSource),
                actionSource,
                errorMessage,
                responseSent
            );
        onEventDeleteFailed(error, retryFunction, actionSource);
        throw error;
    }

    onEventDeleteSuccess();
});

function isInstantDeleteSupported(item: CalendarEvent): boolean {
    // We do not support instant delete for unselected calendars that have no cache.
    return item && isEventsCacheInitialized(item.ParentFolderId.Id);
}

function onDeleteItemStart(
    itemToDelete: CalendarEvent,
    eventScope: EventScope,
    allowLocalDelete: boolean
): CalendarEvent[] {
    let deletedEvents = [];
    if (allowLocalDelete) {
        // Remove item/series from cache
        const folderId = itemToDelete.ParentFolderId.Id;
        if (
            eventScope == EventScope.AllInstancesInSeries ||
            eventScope == EventScope.ThisAndFollowingInstances
        ) {
            let start = itemToDelete.Start;
            deletedEvents = removeCalendarEventsFromEventsCacheMatchingFilter(
                folderId,
                item =>
                    item.InstanceKey == itemToDelete.InstanceKey &&
                    (eventScope == EventScope.AllInstancesInSeries ||
                        (eventScope == EventScope.ThisAndFollowingInstances &&
                            !isBefore(item.Start, start)))
            );
        } else {
            deletedEvents = removeCalendarEventsFromEventsCacheMatchingFilter(
                folderId,
                event => event.ItemId.Id === itemToDelete.ItemId.Id
            );
        }
    }
    return deletedEvents;
}

function undoDelete(deletedEvents: CalendarEvent[], folderId: string, allowLocalDelete: boolean) {
    if (allowLocalDelete) {
        upsertCalendarEventsToEventsCache(folderId, deletedEvents, null, false);
        calendarEventsAdded(deletedEvents);
    }
}
