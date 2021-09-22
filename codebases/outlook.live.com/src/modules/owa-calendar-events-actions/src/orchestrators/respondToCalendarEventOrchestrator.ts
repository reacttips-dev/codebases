import { calendarNotificationsBarUpdateEventFailed } from 'owa-locstrings/lib/strings/calendarnotificationsbarupdateeventfailed.locstring.json';
import loc from 'owa-localize';
import { respondToCalendarEvent } from '../actions/publicActions';
import respondToCalendarEventService from '../services/respondToCalendarEventService';
import { PerformanceDatapoint, returnTopExecutingActionDatapoint } from 'owa-analytics';
import { ViewType, userInteractionAction } from 'owa-calendar-actions';
import type CalendarTime from 'owa-calendar-types/lib/types/CalendarTime';
import type { ClientItemId } from 'owa-client-ids';
import { getEwsRequestString } from 'owa-datetime';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isDeepLink } from 'owa-url';
import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import type BusyType from 'owa-service/lib/contract/BusyType';
import EventScope from 'owa-service/lib/contract/EventScope';
import type RespondToCalendarEventResponse from 'owa-service/lib/contract/RespondToCalendarEventResponse';
import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';

import { orchestrator } from 'satcheljs';
import {
    instantCalendarEventDelete,
    instantCalendarEventUpdate,
    CalendarEventOperationResult,
    getCalendarEventWithId,
    getCalendarEventUpdatesForResponseTypeChange,
} from 'owa-calendar-events-store';
import {
    showUndoNotificationForInstantDelete,
    onDeleteEventFailed,
    onRespondToCalendarEventSuccess,
    onUpdateEventFailed,
} from 'owa-calendar-event-notification-bar';

const AcceptResponseType = 'Accept';
const DeclineResponseType = 'Decline';
const TentativeResponseType = 'Tentative';

/**
 * The action worker which handles cancelling a calendar event.
 */
orchestrator(respondToCalendarEvent, actionMessage => {
    const {
        actionSource,
        itemId,
        proposeNewTime,
        eventScope,
        responseMessage,
        currentResponseType,
        newResponseType,
        currentFreeBusyType,
        sendResponse,
        showingDeclinedEvents,
        meetingMessageId,
    } = actionMessage;

    const dataPoint = returnTopExecutingActionDatapoint((dp: PerformanceDatapoint) => {
        return dp.eventName == 'RespondToEvent';
    });

    const item = getCalendarEventWithId(itemId.Id);
    const isOrganizer = item.IsOrganizer;
    const isMeeting = item.IsMeeting;
    const isException = item.CalendarItemType == 'Exception';

    const promisesQueue = [];

    promisesQueue.push(
        respondToCalendarEventWithCustomService(
            itemId,
            currentResponseType,
            newResponseType,
            currentFreeBusyType,
            eventScope,
            itemIdToRespond =>
                respondToCalendarEventService(
                    itemIdToRespond,
                    itemId.mailboxInfo,
                    newResponseType,
                    sendResponse,
                    responseMessage,
                    proposeNewTime ? getEwsRequestString(proposeNewTime.Start) : '',
                    proposeNewTime ? getEwsRequestString(proposeNewTime.End) : '',
                    meetingMessageId
                ),
            sendResponse,
            actionSource,
            isOrganizer,
            isMeeting,
            proposeNewTime,
            responseMessage,
            showingDeclinedEvents,
            dataPoint
        )
    );
    // This is a short-term workaround until this issue is fixed on server side.
    // In case of Accept/Tentative all series from an exception, we'll also send respond service call for the exception instance with sendResponse = false
    // The workaround doesn't apply to Decline as server will apply Decline response on exception
    if (
        isException &&
        eventScope === EventScope.AllInstancesInSeries &&
        (newResponseType == AcceptResponseType || newResponseType == TentativeResponseType)
    ) {
        promisesQueue.push(
            respondToCalendarEventWithCustomService(
                itemId,
                currentResponseType,
                newResponseType,
                currentFreeBusyType,
                EventScope.Default, // apply the change to the exception instance only
                itemIdToRespond =>
                    respondToCalendarEventService(
                        itemIdToRespond,
                        itemId.mailboxInfo,
                        newResponseType,
                        false /* sendResponse */,
                        null /* responseMessage */,
                        proposeNewTime ? getEwsRequestString(proposeNewTime.Start) : '',
                        proposeNewTime ? getEwsRequestString(proposeNewTime.End) : '',
                        meetingMessageId
                    ),
                false /*sendResponse*/,
                actionSource,
                isOrganizer,
                isMeeting,
                proposeNewTime,
                null /* responseMessage */,
                showingDeclinedEvents,
                null /* dataPoint */
            )
        );
    }

    Promise.all(promisesQueue).then(any => {
        if (isDeepLink() && window.opener) {
            window.close();
        }
    });
});

/**
 * Runs all the business logic required to respond to a calendar event, including the instant update steps.
 * @param calendarEventId ID of the calendar event to respond to
 * @param responseType Response type
 * @param eventScope Whether the response applies to the series or the event reference by ID
 * @param respondService The response service that will actually respond to the event. Takes the calendar ID and a datapoint created by this method
 * @param sendResponse Whether or not send a response to the organizer
 * @param responseMessage Message to include in the response
 * @param actionSource The ViewType from which this action was triggered.
 * @param isOrganizer whether the user is the organizer of the event
 */
async function respondToCalendarEventWithCustomService<T extends RespondToCalendarEventResponse>(
    calendarEventId: ClientItemId,
    currentResponseType: ResponseTypeType,
    newResponseType: ResponseTypeType,
    currentFreeBusyType: BusyType,
    eventScope: EventScope,
    respondService: (itemIdToRespond: BaseItemId) => Promise<T>,
    sendResponse: boolean,
    actionSource: ViewType,
    isOrganizer: boolean,
    isMeeting: boolean,
    proposeNewTime?: CalendarTime,
    responseMessage?: string,
    showingDeclinedEvents?: boolean,
    dataPoint?: PerformanceDatapoint
): Promise<void> {
    if (dataPoint) {
        dataPoint.addCustomData({
            ResponseType: newResponseType,
            SendResponse: sendResponse.toString(),
            ResponseMessageLength: responseMessage ? responseMessage.length : 'n/a',
            ShowingDeclinedEvents: showingDeclinedEvents,
            IsEditRSVP: ['Accept', 'Tentative', 'Decline'].includes(
                currentResponseType
            ) /* has responed */,
            IsProposeNewTime: !!proposeNewTime,
        });
    }

    if (
        newResponseType == DeclineResponseType &&
        !isFeatureEnabled('cal-surface-declinedMeetings')
    ) {
        // Handle as delete
        await new Promise<void>((resolve, reject) => {
            instantCalendarEventDelete(
                calendarEventId,
                eventScope,
                dataPoint, // in case of delete, pass the datapoint so that user perceived time is marked after local lie and does wait for the undo delay
                async itemIdToDelete => {
                    const response = await invokeRespondToCalendarEventService(
                        itemIdToDelete,
                        respondService,
                        null
                    );
                    if (response.isSuccessful) {
                        proposeNewTime
                            ? userInteractionAction(
                                  'ProposeNewTime',
                                  actionSource,
                                  isOrganizer,
                                  isMeeting,
                                  [newResponseType]
                              )
                            : userInteractionAction(
                                  'Decline',
                                  actionSource,
                                  isOrganizer,
                                  isMeeting
                              );
                        onRespondToCalendarEventSuccess(
                            actionSource,
                            newResponseType,
                            !!proposeNewTime
                        );
                    }
                    return response;
                },
                resolve,
                (error, retryFunction, actionSource) => {
                    onDeleteEventFailed(error, retryFunction, actionSource);
                    reject(error);
                },
                actionSource,
                loc(calendarNotificationsBarUpdateEventFailed),
                sendResponse,
                showUndoNotificationForInstantDelete
            );
        });
    } else {
        const calendarItemChanges = getCalendarEventUpdatesForResponseTypeChange(
            currentFreeBusyType,
            currentResponseType,
            newResponseType
        );

        await new Promise<void>((resolve, reject) => {
            instantCalendarEventUpdate(
                calendarEventId,
                calendarItemChanges,
                eventScope,
                async idToUpdate => {
                    const response = await invokeRespondToCalendarEventService(
                        idToUpdate,
                        respondService,
                        dataPoint
                    );
                    if (response.isSuccessful) {
                        proposeNewTime
                            ? userInteractionAction(
                                  'ProposeNewTime',
                                  actionSource,
                                  isOrganizer,
                                  isMeeting,
                                  [newResponseType]
                              )
                            : newResponseType == AcceptResponseType
                            ? userInteractionAction('Accept', actionSource, isOrganizer, isMeeting)
                            : newResponseType == DeclineResponseType
                            ? userInteractionAction('Decline', actionSource, isOrganizer, isMeeting)
                            : userInteractionAction(
                                  'Tentative',
                                  actionSource,
                                  isOrganizer,
                                  isMeeting
                              );
                        onRespondToCalendarEventSuccess(
                            actionSource,
                            newResponseType,
                            !!proposeNewTime
                        );
                    }
                    return response;
                },
                resolve,
                (error, retryFunction, actionSource) => {
                    onUpdateEventFailed(error, retryFunction, actionSource);
                    reject(error);
                },
                actionSource
            );
        });
    }
}

async function invokeRespondToCalendarEventService<T extends RespondToCalendarEventResponse>(
    idToRespond: BaseItemId,
    respondService: (itemIdToRespond: BaseItemId) => Promise<T>,
    dataPoint: PerformanceDatapoint
): Promise<CalendarEventOperationResult> {
    let servicePromise = respondService(idToRespond);
    if (dataPoint) {
        dataPoint.markUserPerceivedTime(); // mark user perceived time as soon as we dispatch the request to respond
    }
    const response = await servicePromise;
    return {
        isSuccessful: response.ResponseClass == 'Success',
    };
}

export default respondToCalendarEvent;
