import { CalendarEventCreateResult, instantCalendarEventCreate } from '../actions/publicActions';
import { expandRecurringItem } from '../utils/expandRecurringItem';
import { addOrModifyItemInCache } from '../utils/SharedCacheFunctions';
import type { ViewType } from 'owa-calendar-actions';
import type {
    default as CalendarEvent,
    CalendarItemTypeTypeEx,
} from 'owa-calendar-types/lib/types/CalendarEvent';
import { orchestrator } from 'satcheljs';
import {
    isEventsCacheInitialized,
    getAllLockedDateRanges,
} from '../selectors/eventsCacheSelectors';
import {
    addCalendarEventsWithinCurrentLockedDateRanges,
    removeCalendarEventsFromEventsCacheMatchingFilter,
} from '../actions/eventsCacheActions';
import {
    applyLocalLiePropertiesToSingleEvent,
    applyLocalLiePropertiesToSeriesEvents,
} from 'owa-calendar-event-local-lie';

orchestrator(instantCalendarEventCreate, async actionMessage => {
    const {
        eventToCreate,
        actionToExecute,
        actionSource,
        onEventCreatedFailed,
        onEventCreatedSuccess,
        errorMessage,
        onEventCreatedLocally,
    } = actionMessage;

    const allowLocalCreate = isInstantCreateSupported(eventToCreate);
    onCreateItemStart(eventToCreate, allowLocalCreate, onEventCreatedLocally, actionSource);

    let retryFunction = () =>
        instantCalendarEventCreate(
            eventToCreate,
            actionToExecute,
            () => onEventCreatedFailed(errorMessage, null, actionSource),
            onEventCreatedSuccess,
            actionSource,
            errorMessage
        );

    let result: CalendarEventCreateResult = null;
    try {
        result = await actionToExecute(eventToCreate);
    } catch (error) {
        // Exception, assume create failed
        onCreateItemFailed(eventToCreate, allowLocalCreate);
        onEventCreatedFailed(error, retryFunction, actionSource);
        throw error;
    }

    let createdItem: CalendarEvent = null;
    if (result.isSuccessful) {
        createdItem = result.createdItem;
        onCreateItemSucceed(eventToCreate, createdItem, allowLocalCreate);
    } else {
        // Either response failed or we got no item back
        onCreateItemFailed(eventToCreate, allowLocalCreate);
        onEventCreatedFailed(errorMessage, retryFunction, actionSource);
        throw errorMessage;
    }

    onEventCreatedSuccess(createdItem);
});

function isInstantCreateSupported(itemBeforeCreate: CalendarEvent): boolean {
    // do not support instant create for unselected calendars that have no cache.
    return isEventsCacheInitialized(itemBeforeCreate.ParentFolderId.Id);
}

function onCreateItemStart(
    itemBeforeCreate: CalendarEvent,
    allowLocalCreate: boolean,
    onEventCreatedLocally: (actionSource: ViewType) => void,
    actionSource: ViewType
) {
    if (allowLocalCreate) {
        const folderId = itemBeforeCreate.ParentFolderId.Id;
        // ADD series occurrences local lie
        if (itemBeforeCreate.Recurrence) {
            // apply local lie properties to the events and add them to the cache
            const allCachedDateRanges = getAllLockedDateRanges(folderId);
            let expandedItems = expandRecurringItem(itemBeforeCreate, allCachedDateRanges);
            applyLocalLiePropertiesToSeriesEvents(expandedItems, false);
            let itemsWithLies = expandedItems.map(occurrence => ({
                ...occurrence,
                CalendarItemType: 'Occurrence' as CalendarItemTypeTypeEx,
            }));
            addCalendarEventsWithinCurrentLockedDateRanges(folderId, itemsWithLies);
        }
        // ADD the single event/ series master local lie
        applyLocalLiePropertiesToSingleEvent(itemBeforeCreate);
        const localLieItem = itemBeforeCreate.Recurrence
            ? {
                  ...itemBeforeCreate,
                  CalendarItemType: 'RecurringMaster' as CalendarItemTypeTypeEx,
              }
            : itemBeforeCreate;
        addCalendarEventsWithinCurrentLockedDateRanges(folderId, [localLieItem]);
    }
    onEventCreatedLocally(actionSource);
}

function onCreateItemSucceed(
    itemBeforeCreate: CalendarEvent,
    itemAfterCreate: CalendarEvent,
    allowLocalCreate: boolean
) {
    // Ensure we have a parent folder id as the create operation may not return this
    if (!itemAfterCreate.ParentFolderId) {
        itemAfterCreate.ParentFolderId = { ...itemBeforeCreate.ParentFolderId };
    }

    if (allowLocalCreate) {
        // do NOT REPLACE series event occurences
        // if item is recurring, we don't get the expanded items back yet so need to wait for notification to allow the
        // occurrences to be editable (see CalendarItemNotification for handling)

        // REPLACE the single event/ series master
        const folderId = itemAfterCreate.ParentFolderId.Id;
        removeCalendarEventsFromEventsCacheMatchingFilter(
            folderId,
            event => event.ItemId.Id === itemBeforeCreate.ItemId.Id
        );
        addOrModifyItemInCache(
            itemAfterCreate,
            true /* wasAlwaysSingleItem - this param is not relavent to the create scenario as it is used
            only when we have an existing item in the cache */,
            false /* modifyOnly is false because we want to add to cache if not present */
        );
    }
}

function onCreateItemFailed(itemBeforeSave: CalendarEvent, allowLocalCreate: boolean) {
    if (allowLocalCreate) {
        const folderId = itemBeforeSave.ParentFolderId.Id;
        // REMOVE series occurrences
        if (itemBeforeSave.Recurrence) {
            // if item is recurring, remove the whole series
            removeCalendarEventsFromEventsCacheMatchingFilter(folderId, item => {
                return item.InstanceKey == itemBeforeSave.InstanceKey;
            });
        }
        // REMOVE the single event / series master
        removeCalendarEventsFromEventsCacheMatchingFilter(
            folderId,
            event => event.ItemId.Id === itemBeforeSave.ItemId.Id
        );
    }
}
