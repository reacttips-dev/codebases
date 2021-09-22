import { dismissAddinsInfoBarLabel } from 'owa-locstrings/lib/strings/dismissaddinsinfobarlabel.locstring.json';
import loc from 'owa-localize';
import type InfoBarMessageViewStateCreator from 'owa-info-bar/lib/schema/InfoBarMessageViewStateCreator';
import WebExtNotificationTypeType from 'owa-service/lib/contract/WebExtNotificationTypeType';
import {
    ExtensibilityNotification,
    getExtensibilityNotification,
    lazyRemoveExtensibilityNotification,
    lazyUpdatePersistentNotifications,
    lazyInitializeExecuteEntryPoint,
    lazyOnLaunchEventTriggered,
} from 'owa-addins-core';
import {
    InfoBarCustomAction,
    InfoBarMessageColor,
    InfoBarMessageRank,
    InfoBarMessageSource,
    InfoBarMessageViewState,
} from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import type { IAddinCommand, AddinCommand } from 'owa-addins-store';
import { logUsage } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';
import LaunchEventType from 'owa-service/lib/contract/LaunchEventType';

export default function createInfoBarMessageViewStateFactory(
    hostItemIndex: string,
    messageId: string,
    removeNotificationMessage: (messageId: string) => void
): InfoBarMessageViewStateCreator {
    return (): InfoBarMessageViewState => {
        const notification = getExtensibilityNotification(messageId);

        if (!notification) {
            return null;
        }

        const dismissAction = getDismissAction(
            hostItemIndex,
            messageId,
            notification,
            removeNotificationMessage
        );

        const CustomAction =
            notification.Actions?.CustomButtonAction && notification.Actions.NotificationActionData
                ? getCustomAction(
                      hostItemIndex,
                      notification.Actions.NotificationActionData.actionText,
                      notification.Actions.CustomButtonAction
                  )
                : '';

        return <InfoBarMessageViewState>{
            key: notification.Key,
            source: InfoBarMessageSource.Extensibility,
            rank: getRank(notification.Type),
            messageParts: getMessageParts(dismissAction, CustomAction, notification),
            color: InfoBarMessageColor.Grey,
            icon: notification.Actions ? notification.Actions.CustomButtonIcon : null,
        };
    };
}

function getMessageParts(dismissAction, customAction, notification) {
    return notification.Actions?.CustomButtonAction
        ? [notification.Message, '|', customAction, '|', dismissAction]
        : [notification.Message, '|', dismissAction];
}

function getDismissAction(
    hostItemIndex: string,
    messageId: string,
    notification: ExtensibilityNotification,
    removeNotificationMessage: (messageId: string) => void
): InfoBarCustomAction {
    return <InfoBarCustomAction>{
        text: loc(dismissAddinsInfoBarLabel),
        action: () => {
            let isClickableInfobar: boolean = false;
            if (notification.Actions) {
                isClickableInfobar = true;
            }
            // Log custom event on click
            logUsage('DissmissButtonClicked', { IsClickableInfobar: isClickableInfobar });

            const extensionId = notification.ExtensionId;
            const isPersistent = notification.Persistent;

            lazyRemoveExtensibilityNotification.import().then(removeExtensibilityNotification => {
                removeExtensibilityNotification(messageId);

                if (isPersistent) {
                    lazyUpdatePersistentNotifications
                        .import()
                        .then(updatePersistentNotifications => {
                            updatePersistentNotifications(hostItemIndex, extensionId);
                        });
                }
            });
            removeNotificationMessage(messageId);

            if (
                isFeatureEnabled('addin-autoRun') &&
                isFeatureEnabled('addin-autoRun-infobarDismissClickedEvent')
            ) {
                lazyOnLaunchEventTriggered.importAndExecute(
                    hostItemIndex,
                    LaunchEventType.OnInfoBarDismissClicked
                );
            }
        },
    };
}

function getCustomAction(
    hostItemIndex: string,
    actionText: string,
    addinCommand: IAddinCommand
): InfoBarCustomAction {
    return <InfoBarCustomAction>{
        text: actionText,
        action: () => {
            // Log custom event on click
            logUsage('ClickableInfoBarClicked');

            lazyInitializeExecuteEntryPoint.importAndExecute(
                hostItemIndex,
                addinCommand as AddinCommand
            );
        },
    };
}

function getRank(type: WebExtNotificationTypeType): InfoBarMessageRank {
    switch (type) {
        case WebExtNotificationTypeType.InformationalMessage:
        case WebExtNotificationTypeType.ProgressIndicator:
            return InfoBarMessageRank.Info;
        case WebExtNotificationTypeType.ErrorMessage:
            return InfoBarMessageRank.Error;
        case WebExtNotificationTypeType.InsightMessage:
            return InfoBarMessageRank.InsightMessage;
    }
    return InfoBarMessageRank.Safety;
}
