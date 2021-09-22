import { deleteCalendarEvent } from '../actions/publicActions';
import deleteCalendarEventService from '../services/deleteCalendarEventService';
import removeBirthdayEventService from '../services/removeBirthdayEventService';
import { returnTopExecutingActionDatapoint } from 'owa-analytics';
import { userInteractionAction } from 'owa-calendar-actions';
import { isBirthdayEvent } from 'owa-calendar-event-capabilities';
import { instantCalendarEventDelete } from 'owa-calendar-events-store';
import { isDeepLink } from 'owa-url';
import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';
import { orchestrator } from 'satcheljs';
import {
    onDeleteEventFailed,
    showUndoNotificationForInstantDelete,
} from 'owa-calendar-event-notification-bar';
import { lazyDeleteEventTravelBookends, lazyLogDeleteTravelTimeEvent } from 'owa-mobility-common';
import { isFeatureEnabled } from 'owa-feature-flags';
import EventScope from 'owa-service/lib/contract/EventScope';

/**
 * The action worker which handles deleting a calendar event.
 * @param item - the event that needs to be deleted
 * @param eventScope The scope of the event which should be deleted.
 * @param actionSource The ViewType from which this delete action was triggered. This will logged for the userInteractionAction and currently not used anywhere other than Search scenarios
 * @param onDelete The action to take after sending the server delete request. Typically to dismiss the peek/read view
 */
orchestrator(deleteCalendarEvent, async actionMessage => {
    const { item, eventScope, actionSource, onDelete } = actionMessage;
    const dataPoint = returnTopExecutingActionDatapoint();
    if (dataPoint) {
        dataPoint.addCustomData({
            isGroupMailbox: item.ItemId.mailboxInfo.type == 'GroupMailbox',
            CalendarItemType: item.CalendarItemType,
        });
    }

    if (
        isFeatureEnabled('cal-mf-mobility') &&
        (eventScope == EventScope.ThisInstanceOnly || eventScope == EventScope.Default)
    ) {
        lazyLogDeleteTravelTimeEvent.importAndExecute(item.ItemId.Id, item.Start, item.End);
    }

    const deleteService: (itemId: BaseItemId) => Promise<SingleResponseMessage> = isBirthdayEvent(
        item
    )
        ? itemIdToDelete => removeBirthdayEventService(itemIdToDelete, item.ItemId.mailboxInfo)
        : itemIdToDelete =>
              deleteCalendarEventService(itemIdToDelete, eventScope, item.ItemId.mailboxInfo);

    if (onDelete) {
        onDelete();
    }

    await new Promise<void>((resolve, reject) => {
        instantCalendarEventDelete(
            item.ItemId,
            eventScope,
            dataPoint, // pass the datapoint so that user perceived time can be marked after local lie is done; because service call is waited by undo action, we can no longer mark it in the callback here
            async itemIdToDelete => {
                const response = await deleteService(itemIdToDelete);
                const isResponseSuccessful = response.ResponseClass == 'Success';
                if (isResponseSuccessful) {
                    userInteractionAction('Delete', actionSource, item.IsOrganizer, item.IsMeeting); // trigger user interaction action for delete upon success

                    if (
                        isFeatureEnabled('cal-mf-mobility') &&
                        (eventScope == EventScope.ThisInstanceOnly ||
                            eventScope == EventScope.Default)
                    ) {
                        lazyDeleteEventTravelBookends.importAndExecute(item);
                    }
                }
                return { isSuccessful: isResponseSuccessful };
            },
            resolve,
            (error, retryFunction, actionSource) => {
                onDeleteEventFailed(error, retryFunction, actionSource);
                reject(error);
            },
            actionSource,
            undefined,
            undefined,
            showUndoNotificationForInstantDelete
        );
    });

    // Deeplink cannot use the onDelete callback, because it requires the action to complete before closing the window
    if (isDeepLink() && window.opener) {
        window.close();
    }
});
