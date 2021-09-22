import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

/**
 * List of Calendar Events to be sent back to 3S
 */
export type ActionType =
    | 'ViewOpened' // A view from the ViewType list is opened
    | 'ViewClosed' // A view from the ViewType list is closed
    | 'EventEdited' // A calendar event is successfully edited.
    | 'Delete' // A calendar event is successfully deleted
    | 'Cancel' // A calendar event is successfully cancelled
    | 'Accept' // A calendar event is successfully accepted
    | 'Tentative' // A calendar event is successfully responded with Tentative
    | 'Decline' // A calendar event is successfully declined
    | 'ProposeNewTime' // A calendar event is successfully responded with ProposeNewTime
    | 'Reply' // Reply pop-out is opened for the calendar event
    | 'ReplyAll' // ReplyAll pop-out is opened for the calendar event
    | 'Forward' // A calendar event is successfully forwarded
    | 'EventInteracted' // User started some update action on the calendar event but did not save it
    | 'LinkClicked' // User clicked on a link from within the calendar event viz Join Online Meeting, View Series etc
    | 'JoinOnlineMeeting' // User clicked on a button from within the calendar event to join the online meeting
    | 'TxpEventShared' // A TXP event is successfully shared from readform
    | 'Discard' // A calendar event is discarded without saving.
    | 'TxpEmailViewed' // The mail corresponding to the TXP calendar event is opened from readform
    | 'TxpActionClicked' // User clicked on a link to perform update actions for a TXP event (modify reservation, pay bill etc..)
    | 'JoinOnlineMeetingThruLink' // User clicked on the calendar invite link from within the calendar event to join the online meeting
    | 'EventDeleteInitiated' // User initiated the calendar event delete action
    | 'EventDeleteConfirmed' // User confirmed the calendar event delete action
    | 'EventDeleteCancelled'; // User cancelled the calendar event delete action

/**
 * List of Calendar Views to be sent back to 3S
 * Only ReadForm and EditForm are being used so far in Search, rest of the viewTypes have been added for futuristic purposes
 */
export type ViewType =
    | 'Addin'
    | 'AgendaView'
    | 'ReadForm'
    | 'EditForm'
    | 'SearchResultsList'
    | 'SurfacePeek'
    | 'SurfaceContextMenu'
    | 'Surface'
    | 'TimePanelCalendar'
    | 'TimePanelPeek'
    | 'TimePanelContextMenu'
    | 'TimePanelCompose'
    | 'MailCalendarCard'
    | 'MailListMessage'
    | 'CalendarAnswer'
    | 'SpacesGoalAsset'
    | 'SpacesCalendarAsset'
    | 'SpacesCalendarAssetContextMenu'
    | 'TimePanelAgenda'
    | 'MonthAgenda'
    | 'ActivityFeed'
    | 'Eventify'
    | 'WidgetView';

/**
 * Action invoked when user interacts with a search result item
 * @param interactionType what action was performed by the user
 * @param viewType in what view was the action performed
 * @param isOrganizer whether the user is organizer of the event
 * @param propertyNames what properties of the calendar event were updated
 */
export let userInteractionAction = action(
    'UserInteractionAction',
    (
        interactionType: ActionType,
        viewType: ViewType,
        isOrganizer: boolean,
        isMeeting: boolean,
        propertyNames?: string[]
    ) => {
        const propertyNamesList =
            propertyNames && propertyNames.length > 0 ? propertyNames.join() : '';
        return addDatapointConfig(
            {
                name: 'userInteractionAction',
                customData: {
                    interactionType,
                    viewType,
                    propertyNamesList,
                    isOrganizer,
                    isMeeting,
                },
                options: {
                    isCore: true,
                },
            },
            {
                interactionType,
                viewType,
                isOrganizer,
                propertyNames,
            }
        );
    }
);
