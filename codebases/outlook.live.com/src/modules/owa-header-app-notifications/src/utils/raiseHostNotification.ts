import type { ReminderData } from '../store/schema/ReminderData';
import {
    raiseNotification,
    NotificationContext,
    NotificationDisplayType,
    NotificationAction,
    NotificationCustomAction,
    ButtonProperty,
    ActionProperty,
    DropdownAction,
    ActionType,
} from 'owa-client-pie/lib/notification.g';
import { isPieHostBridgeInitialized } from 'owa-client-pie';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';
import { formatWeekDayTime } from 'owa-datetime';
import { EventReminderActionIds, NewEmailActionIds } from './ButtonId';
import { reminder_snooze_header } from '../components/reminders/ReminderForCalendarOrTask.locstring.json';
import loc from 'owa-localize';
import {
    notification_dismiss_title,
    notification_flag_title,
    notification_snoozedropdown_title,
    notification_5minsnoozedropdown_title,
    notification_10minsnoozedropdown_title,
} from './windowsNotificationStrings.locstring.json';
import { isFeatureEnabled } from 'owa-feature-flags';
import { NotificationTypes } from './NotificationTypes';
import { getCdnUrl } from 'owa-config';
import * as trace from 'owa-trace';
import sentNewEmailToNativeStatus from '../mutators/sentNewEmailToNativeStatus';
import getStore from '../store/store';
import { logUsage } from 'owa-analytics';
import {
    getNotificationSettingsStore,
    DesktopNotificationSetting,
    MessageNotificationSetting,
} from 'monarch-desktop-notifications-settings';
import { PersonaSize } from '@fluentui/react/lib/Persona';
import { isPersonaInFavorites } from 'owa-favorites';
import mapPersonaToPersonaViewState from 'owa-persona/lib/actions/helpers/mapPersonaToPersonaViewState';
import getHexConsumerIdForUser from 'owa-persona/lib/actions/getHexConsumerIdForUser';
import downloadPersonaPhoto from 'owa-persona/lib/actions/downloadPersonaPhoto';
import store from 'owa-persona/lib/store/Store';
import { ReminderProperty } from './handleNotificationAction';
import setReminderSentToNativeStatus from '../mutators/setReminderSentToNativeStatus';

const nativeHostNotificationAssetsPath = 'assets/native-host/notifications/';

export function raiseEventNotification(reminders: ReminderData[]) {
    // Send reminder notification pie event to the native host app if isShown and the pieBridge is initialized
    if (
        isPieHostBridgeInitialized() &&
        isFeatureEnabled('auth-mon-reminderNotifications') &&
        isEventReminderNotificationEnabled()
    ) {
        let customAction = [
            {
                actionType: ActionType.DropdownAction,
                button: {
                    buttonId: EventReminderActionIds.SnoozeButton,
                    iconUrl: getActionIconUrl('Snooze'),
                    displayText: loc(reminder_snooze_header),
                } as ButtonProperty,
                action: {
                    buttonId: EventReminderActionIds.SnoozeDropdownOptions,
                    iconUrl: '',
                    displayText: loc(notification_snoozedropdown_title),
                    items: [
                        {
                            displayContent: loc(notification_5minsnoozedropdown_title),
                            id: '5',
                        } as DropdownAction,
                        {
                            displayContent: loc(notification_10minsnoozedropdown_title),
                            id: '10',
                        } as DropdownAction,
                    ],
                } as ActionProperty,
            } as NotificationCustomAction,
            {
                actionType: ActionType.ButtonAction,
                button: {
                    buttonId: EventReminderActionIds.DismissButton,
                    iconUrl: getActionIconUrl('Dismiss'),
                    displayText: loc(notification_dismiss_title),
                } as ButtonProperty,
            } as NotificationAction,
        ];
        const { remindersHost } = getStore();
        logUsage('NativeNotificationEventReminderReceivedCount', {
            reminderCount: reminders.length,
        });
        reminders
            .filter(
                /// Only send a notification to native host when the reminder does not exist in reminderHost table
                reminder =>
                    remindersHost.filter(sentNotification =>
                        isSameReminder(sentNotification.reminder, reminder)
                    ).length == 0
            )
            .forEach(rem => {
                logUsage('NativeNotificationEventReminderRaisedCount', {
                    reminderCount: 1,
                });
                const reminderData = {
                    itemId: rem.itemId.Id,
                    changeKey: rem.itemId.ChangeKey ?? '',
                    meetingTime: rem.startTime,
                    reminderType: rem.reminderType,
                } as ReminderProperty;
                const reminder = JSON.stringify(reminderData);
                setReminderSentToNativeStatus(rem, true);
                let notificationContext = {
                    bringAppToForeground: false,
                    notificationDisplayType:
                        NotificationDisplayType.ThreeActionNotificationWithDropdown,
                    text: [rem.subject, rem.location, formatWeekDayTime(rem.startTime)],
                    notificationType: NotificationTypes.EventReminder,
                    originSmtpEmailAddress: '',
                    isFutureNotification: false,
                    scheduledTime: null,
                    itemId: reminder,
                    originName: '',
                    upn: getUserConfiguration().SessionSettings?.UserPrincipalName,
                    notificationActions: customAction,
                    isSilent: false,
                    originDisplayImageUrl: '',
                } as NotificationContext;
                raiseNotification(notificationContext).catch(e => {
                    trace.errorThatWillCauseAlert('CouldNotSendReminderNotificationToHost', e);
                });
                logUsage('NativeNotificationEventReminderRaisedNotification');
            });
    }
}

export async function raiseNewEmailNotification(newEmailNotifications: NewMailNotificationPayload) {
    // Send reminder notification pie event to the native host app if isShown and the pieBridge is initialized
    if (
        isPieHostBridgeInitialized() &&
        isFeatureEnabled('auth-mon-newEmailNotifications') &&
        shouldSendNewEmailNotification(newEmailNotifications.SenderSmtpEmailAddress)
    ) {
        const { newMailNotificationsSentToHost } = getStore();
        const newEmailNotificationSent = newMailNotificationsSentToHost.get(
            newEmailNotifications.ItemId
        );
        if (!newEmailNotificationSent?.ItemId) {
            sentNewEmailToNativeStatus(newEmailNotifications.ItemId, newEmailNotifications);
            let customAction = [
                {
                    actionType: ActionType.ButtonAction,
                    button: {
                        buttonId: NewEmailActionIds.SetFlagButton,
                        iconUrl: getActionIconUrl('Flag'),
                        displayText: loc(notification_flag_title),
                    } as ButtonProperty,
                } as NotificationAction,
                {
                    actionType: ActionType.ButtonAction,
                    button: {
                        buttonId: NewEmailActionIds.DismissButton,
                        iconUrl: getActionIconUrl('Dismiss'),
                        displayText: loc(notification_dismiss_title),
                    } as ButtonProperty,
                } as NotificationAction,
            ];

            // get the persona image content
            let personaBlob = [];
            try {
                let buffer = await getPersonaPhotoFromEmail(
                    newEmailNotifications.SenderSmtpEmailAddress
                );
                personaBlob = Array.from(new Uint8Array(buffer));
            } catch (e) {
                logUsage('NativeNotificationFailedToGetPersonaImage', null, { isCore: true });
                trace.EmptyErrorStack;
            }

            let notificationContext = {
                bringAppToForeground: true,
                notificationDisplayType: NotificationDisplayType.ThreeActionNotificationWithImage,
                text: [
                    newEmailNotifications.Sender,
                    newEmailNotifications.Subject,
                    newEmailNotifications.PreviewText,
                ],
                notificationType: NotificationTypes.NewEmail,
                originSmtpEmailAddress: newEmailNotifications.SenderSmtpEmailAddress,
                isFutureNotification: false,
                scheduledTime: null,
                itemId: newEmailNotifications.ItemId,
                originName: newEmailNotifications.Sender,
                upn: getUserConfiguration().SessionSettings?.UserPrincipalName,
                notificationActions: customAction,
                originDisplayImageUrl: getPersonaPlaceholderUrl(),
                isSilent: false,
                personaImage: personaBlob,
            } as NotificationContext;
            raiseNotification(notificationContext).catch(e => {
                trace.errorThatWillCauseAlert('CouldNotSendNewEmailNotificationToHost', e);
            });
            logUsage('NativeNotificationNewEmailRaisedNotification');
        }
    }
}

function isSameReminder(rem1: ReminderData, rem2: ReminderData) {
    return (
        rem1.startTime === rem2.startTime &&
        rem1.endTime === rem2.endTime &&
        rem1.reminderTime === rem2.reminderTime &&
        rem1.location === rem2.location &&
        rem1.itemId === rem2.itemId &&
        rem1.subject === rem2.subject
    );
}

function isEventReminderNotificationEnabled(): boolean {
    let store = getNotificationSettingsStore();
    return (
        (store.settings.get(DesktopNotificationSetting.DesktopSettingEnabled) as boolean) &&
        (store.settings.get(
            DesktopNotificationSetting.EventReminderNotificationSettingEnabled
        ) as boolean)
    );
}

function shouldSendNewEmailNotification(senderSmtp: string): boolean {
    // Check if new email notification setting is enabled
    const newEmailSettingEnabled =
        getNotificationSettingsStore().settings.get(
            DesktopNotificationSetting.DesktopSettingEnabled
        ) &&
        getNotificationSettingsStore().settings.get(
            DesktopNotificationSetting.NewMailNotificationSettingEnabled
        );

    // Check if the setting is enabled for inbox or for favorites.
    if (
        newEmailSettingEnabled &&
        getNotificationSettingsStore().settings.get(
            DesktopNotificationSetting.NewMailNotificationOption
        ) == MessageNotificationSetting.Inbox
    ) {
        return true;
    } else if (
        newEmailSettingEnabled &&
        getNotificationSettingsStore().settings.get(
            DesktopNotificationSetting.NewMailNotificationOption
        ) == MessageNotificationSetting.Favorite
    ) {
        return isPersonaInFavorites(null, senderSmtp);
    }
    return false;
}

function getActionIconUrl(iconName: string): string {
    return `https:${getCdnUrl()}${nativeHostNotificationAssetsPath}${iconName}.ico`;
}

async function downloadImageContent(url: string): Promise<ArrayBuffer> {
    let response = await fetch(url);
    const buffer = await response.arrayBuffer();
    logUsage('NativeNotificationDownloadImageContent', null, { isCore: true });
    return buffer;
}

async function getPersonaPhotoFromEmail(email: string): Promise<ArrayBuffer> {
    // See if we have state saved in store
    let targetViewState = null;
    store.viewStates.forEach(viewState => {
        if (viewState.emailAddress == email) {
            targetViewState = viewState;
        }
    });

    // create persona view state if needed
    if (targetViewState == null) {
        let hexCid = getHexConsumerIdForUser(email);
        targetViewState = mapPersonaToPersonaViewState(
            null,
            hexCid,
            email,
            null,
            PersonaSize.regular,
            null
        );
    }

    // download the photo
    await downloadPersonaPhoto(targetViewState, false /*forceFetch*/);

    // get the url of the cached photo
    let url = '';
    if (
        !targetViewState.personaBlob.isPendingFetch &&
        !targetViewState.personaBlob.hasFetchFailed
    ) {
        url = targetViewState.personaBlob.blobUrl;
    }

    let buffer = url == '' ? new ArrayBuffer(0) : await downloadImageContent(url);
    logUsage('NativeNotificationGetPersonaPhotoFromEmail', { email, url }, { isCore: true });
    return buffer;
}

function getPersonaPlaceholderUrl(): string {
    return `https:${getCdnUrl()}${nativeHostNotificationAssetsPath}PersonaPlaceholder.png`;
}
