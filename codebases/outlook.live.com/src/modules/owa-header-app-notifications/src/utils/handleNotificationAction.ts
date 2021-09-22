import {
    registerForHandleUserActionOnNotification,
    UserInteraction,
} from 'owa-client-pie/lib/notification.g';
import { dismissReminder, snoozeReminder } from 'owa-reminder-orchestration';
import { addMinutes, now, formatUserDateTime, OwaDate } from 'owa-datetime';
import onReminderClicked from '../actions/onReminderClicked';
import removeNewMailNotification from '../mutators/removeNewMailNotification';
import onNewMailOSNotificationClicked from '../actions/onNewMailOSNotificationClicked';
import { EventReminderActionIds, NewEmailActionIds } from './ButtonId';
import { NotificationTypes } from './NotificationTypes';
import * as trace from 'owa-trace';
import { logUsage } from 'owa-analytics';
import ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';
import removeReminderHost from '../mutators/removeReminderHost';
export default function registerNotificationHandler() {
    registerForHandleUserActionOnNotification(action => {
        let notificationType = action.notificationType;
        switch (notificationType) {
            case NotificationTypes.EventReminder:
                handlerEventReminderAction(action);
                break;
            case NotificationTypes.NewEmail:
                handleNewEmailAction(action);
                break;
            default:
                trace.errorThatWillCauseAlert(
                    'Got an eventType action handler which is not known ' + notificationType
                );
                break;
        }
    });
}

export interface NotificationProperty {
    itemId: string;
}

export interface ReminderProperty extends NotificationProperty {
    meetingTime: OwaDate;
    reminderType: ReminderGroupTypes;
    changeKey: string;
}

function handlerEventReminderAction(action: UserInteraction) {
    let eventReminderProperties = JSON.parse(action.itemId) as ReminderProperty;
    switch (action.buttonId) {
        case EventReminderActionIds.SnoozeButton:
            snoozeReminderHandler(action.selectedActionId, eventReminderProperties);
            break;
        case EventReminderActionIds.DismissButton:
            dismissReminderHandler(eventReminderProperties.itemId);
            break;
        case EventReminderActionIds.Click:
            reminderClicked(eventReminderProperties);
            break;
        default:
            //By default open the reminder item.
            trace.errorThatWillCauseAlert(
                'Got an action type for a button which was not recognised. Falling back to the default action' +
                    action.buttonId
            );
            onReminderClicked(eventReminderProperties.itemId, eventReminderProperties.reminderType);
            break;
    }
}

function handleNewEmailAction(action: UserInteraction) {
    let buttonType = action.buttonId;
    switch (buttonType) {
        case NewEmailActionIds.DismissButton:
            dismissItem(action.itemId);
            break;
        case NewEmailActionIds.SetFlagButton:
            flagEmail(action.itemId);
            break;
        case NewEmailActionIds.Click:
            newEmailClicked(action.itemId);
            break;
        default:
            //By default open the new email item.
            newEmailClicked(action.itemId);
            trace.errorThatWillCauseAlert(
                'Got an action type for a button which was not recognised. Falling back to the default action ' +
                    buttonType
            );
            break;
    }
}

function snoozeReminderHandler(selectedActionId: string, eventProperty: ReminderProperty) {
    let startTime = eventProperty.meetingTime;
    let snoozeMinutes = selectedActionId;
    logUsage('NativeNotificationEventReminderSnoozeAction', {
        snoozedTillTime: formatUserDateTime(addMinutes(now(), +snoozeMinutes)),
        meetingStartTime: formatUserDateTime(startTime),
    });
    if (snoozeMinutes) {
        snoozeReminder(
            { Id: eventProperty.itemId, ChangeKey: eventProperty.changeKey },
            addMinutes(now(), +snoozeMinutes)
        );
        removeReminderHost(eventProperty.itemId);
    }
}

function dismissReminderHandler(itemId: string) {
    logUsage('NativeNotificationNewEmailDismissAction');
    dismissReminder({ Id: itemId });
}

function reminderClicked(reminderData: ReminderProperty) {
    logUsage('NativeNotificationEventReminderClickAction');
    onReminderClicked(reminderData.itemId, reminderData.reminderType);
}

function dismissItem(itemId: string) {
    logUsage('NativeNotificationNewEmailDismissAction');
    if (itemId) {
        removeNewMailNotification(itemId);
    }
}

function newEmailClicked(itemId: string) {
    logUsage('NativeNotificationNewEmailClickAction');
    if (itemId) {
        onNewMailOSNotificationClicked(itemId);
    }
}

function flagEmail(itemId: string) {
    logUsage('NativeNotificationNewEmailFlagAction');
    // ToDo: Need to add flagging functionality
}
