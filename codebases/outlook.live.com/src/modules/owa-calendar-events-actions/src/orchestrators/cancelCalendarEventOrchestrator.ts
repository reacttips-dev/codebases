import { calendarNotificationsBarDeleteEventFailed } from 'owa-locstrings/lib/strings/calendarnotificationsbardeleteeventfailed.locstring.json';
import loc from 'owa-localize';
import { cancelCalendarEvent } from '../actions/publicActions';
import cancelCalendarEventService from '../services/cancelCalendarEventService';
import { PerformanceDatapoint, returnTopExecutingActionDatapoint } from 'owa-analytics';
import { userInteractionAction, ViewType } from 'owa-calendar-actions';
import { getCalendarEventWithId, instantCalendarEventDelete } from 'owa-calendar-events-store';
import type { ClientItemId } from 'owa-client-ids';
import { lazyLogFloodgateActivity } from 'owa-floodgate-feedback-view';
import { isDeepLink } from 'owa-url';
import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import EventScope from 'owa-service/lib/contract/EventScope';
import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';
import {
    showUndoNotificationForInstantDelete,
    onDeleteEventFailed,
} from 'owa-calendar-event-notification-bar';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

import { orchestrator } from 'satcheljs';

/**
 * The action worker which handles cancelling a calendar event.
 * @param itemId - the event that needs to be deleted
 * @param actionSource The ViewType from which this cancel action was triggered. This will logged for the userInteractionAction and currently not used anywhere other than Search scenarios
 * @param cancellationMessage Message to send to the attendees on the cancellation email
 * @param eventScope The scope of the event which should be deleted.
 * @param onCancellationSent The action to take after sending the server cancel request. Typically to dismiss the peek/read view
 */
orchestrator(cancelCalendarEvent, async actionMessage => {
    const {
        itemId,
        actionSource,
        cancellationMessage,
        eventScope,
        onCancellationSent,
    } = actionMessage;

    const dataPoint = returnTopExecutingActionDatapoint();

    // Log floodgate activity for cancelling a meeting. If the user doesn't belong to this group, triggering will be a no-op.
    if (isHostAppFeatureEnabled('floodgate')) {
        const logFloodgateActivity = await lazyLogFloodgateActivity.import();
        logFloodgateActivity('MeetingCanceled');
    }

    const itemToDelete = getCalendarEventWithId(itemId.Id);
    const isOrganizer = itemToDelete.IsOrganizer;
    const isMeeting = itemToDelete.IsMeeting;

    if (onCancellationSent) {
        onCancellationSent();
    }

    if (dataPoint) {
        dataPoint.addCustomData({
            CalendarItemType: itemToDelete.CalendarItemType,
        });
    }

    await cancelCalendarEventWithCustomService(
        itemId,
        itemIdToDelete =>
            cancelCalendarEventService(
                itemIdToDelete,
                eventScope,
                itemId.mailboxInfo,
                cancellationMessage
            ),
        actionSource,
        eventScope,
        isOrganizer,
        isMeeting,
        cancellationMessage,
        dataPoint
    );

    // Deeplink cannot use the onCancellationSent callback, because it requires the action to complete before closing the window
    if (isDeepLink() && window.opener) {
        window.close();
    }
});

/**
 * Runs all the business logic required to cancel a calendar event, including the instant update steps.
 * @param calendarEventId ID of the calendar event to cancel
 * @param cancelService The service that will actually cancel the event. Takes the calendar ID and a datapoint created by this method
 * @param actionSource The ViewType from which this cancel action was triggered.
 * @param eventScope
 * @param isOrganizer whether user is the organizer of the event
 * @param cancellationMessage Message to send to the attendees on the cancellation email,
 */
async function cancelCalendarEventWithCustomService(
    calendarEventId: ClientItemId,
    cancelService: (itemIdToCancel: BaseItemId) => Promise<SingleResponseMessage>,
    actionSource: ViewType,
    eventScope: EventScope,
    isOrganizer: boolean,
    isMeeting: boolean,
    cancellationMessage?: string,
    dataPoint?: PerformanceDatapoint
): Promise<void> {
    eventScope = eventScope ? eventScope : EventScope.Default;
    if (dataPoint) {
        dataPoint.addCustomData({
            CancelSeries: eventScope.toString(),
            CancellationMessageLength: cancellationMessage
                ? cancellationMessage.length.toString()
                : 'n/a',
        });
    }

    await new Promise<void>((resolve, reject) => {
        instantCalendarEventDelete(
            calendarEventId,
            eventScope,
            dataPoint,
            async itemIdToDelete => {
                const response = await cancelService(itemIdToDelete);
                const isResponseSuccessful = response.ResponseClass == 'Success';
                if (isResponseSuccessful) {
                    userInteractionAction('Cancel', actionSource, isOrganizer, isMeeting); // trigger user interaction action for delete upon success
                }
                return { isSuccessful: isResponseSuccessful };
            },
            resolve,
            (error, retryFunction, actionSource) => {
                onDeleteEventFailed(error, retryFunction, actionSource);
                reject(error);
            },
            actionSource,
            loc(calendarNotificationsBarDeleteEventFailed),
            true /* responseSent */,
            showUndoNotificationForInstantDelete
        );
    });
}

export default cancelCalendarEvent;
