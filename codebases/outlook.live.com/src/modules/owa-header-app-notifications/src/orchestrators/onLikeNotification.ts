import addLikeNotification from '../mutators/addLikeNotification';
import { getPackageBaseUrl } from 'owa-config';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import removeAllLikeNotifications from '../mutators/removeAllLikeNotifications';
import removeLikeNotification from '../mutators/removeLikeNotification';
import UserSocialActivityActionType from 'owa-service/lib/contract/UserSocialActivityActionType';
import { userDate } from 'owa-datetime';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import type { LikeNotificationData } from '../store/schema/LikeNotificationData';
import { orchestrator } from 'satcheljs';
import { playSound } from 'owa-audio';
import {
    socialActivityNotificationAction,
    SocialActivityNotificationPayload,
} from 'owa-app-notifications-core';
import { shouldNewLikeNotificationBeFiltered } from '../utils/newLikeNotificationFilter';

export const LIKE_WINDOW_TIMER_TIMEOUT = 30000; //30s to aggregate like notifications
export const LIKE_NOTIFICATION_TIMEOUT = 7000; //10s to dismiss like notifications
export const NEW_LIKE_SOUND_URI = 'resources/sounds/notifications/socialactivity.mp3';

let likeWindowOverrunTimer = null;
let areEventsRegistered = false;
const likeNotificationDicionary: { [key: string]: LikeNotificationData } = {};
let likeNotificationsKeys: string[] = [];

export default orchestrator(socialActivityNotificationAction, message => {
    const notification = message.notification as SocialActivityNotificationPayload;
    if (notification.EventType === 'Reload' || shouldNewLikeNotificationBeFiltered(notification)) {
        return;
    }

    // We only care about likes notification
    if (
        notification.Action !== UserSocialActivityActionType.Like &&
        notification.Action !== UserSocialActivityActionType.MeLike
    ) {
        return;
    }

    // If existing in the dicionary and it is an existing actor, just aggregate
    if (likeNotificationDicionary[notification.Target.TargetLogicalId]) {
        if (
            !hasDuplicateActor(
                likeNotificationDicionary[notification.Target.TargetLogicalId],
                notification.Actor
            )
        ) {
            // If this notification does not exist yet on the array, add it
            if (likeNotificationsKeys.indexOf(notification.Target.TargetLogicalId) === -1) {
                likeNotificationsKeys.push(notification.Target.TargetLogicalId);
            }

            aggregateLikeNotificationData(
                likeNotificationDicionary[notification.Target.TargetLogicalId],
                notification
            );
        }
    } else {
        const likeNotificationData: LikeNotificationData = {
            actors: [notification.Actor],
            subject: notification.Target.TargetSubject,
            preview: notification.Metadata.MessagePreview,
            conversationId: notification.Target.TargetConversationId.Id,
            itemId: notification.Target.TargetItemId.Id,
            date: userDate(notification.CreatedTimeStamp),
            group: notification.Metadata.TargetGroupName,
            targetLogicalId: notification.Target.TargetLogicalId,
            mailboxSMTP: notification.Target.TargetMailboxSmtpAddress,
            mailboxGuid: notification.Target.TargetMailboxGuid,
        };

        likeNotificationsKeys.push(notification.Target.TargetLogicalId);
        likeNotificationDicionary[notification.Target.TargetLogicalId] = likeNotificationData;
    }

    // If the timer is set, keep aggregating
    if (!likeWindowOverrunTimer) {
        likeWindowOverrunTimer = setTimeout(
            addNotificationToastsForNotifications,
            LIKE_WINDOW_TIMER_TIMEOUT
        );
    }

    if (!areEventsRegistered) {
        document.addEventListener('visibilitychange', onDocumentActiveStatusChange);
        document.addEventListener('focus', onDocumentActiveStatusChange);
        areEventsRegistered = true;
    }
});

function onDocumentActiveStatusChange() {
    // If the document gets to be in active state,
    // we do auto-dismiss the existing notifications
    if (isDocumentActive()) {
        setTimeout(removeAllLikeNotifications, LIKE_NOTIFICATION_TIMEOUT);
    }
}

function addNotificationToastsForNotifications() {
    // Clear the timeout so we can start aggregating notifications again
    clearTimeout(likeWindowOverrunTimer);
    likeWindowOverrunTimer = null;

    // Show all the new notification retrieving their data from
    // the dictionary
    likeNotificationsKeys.forEach(key => {
        // Create a copy of the dictionary data
        const notification = { ...likeNotificationDicionary[key] };

        // If a notification with the same Id is shown, remove it
        // If not, it will be a no-op
        removeLikeNotification(notification);

        // Then add the new or add back with the updated data
        addLikeNotification(notification);

        // If the document is active, we do auto-dismiss
        if (isDocumentActive()) {
            setTimeout(() => removeLikeNotification(notification), LIKE_NOTIFICATION_TIMEOUT);
        }
    });

    likeNotificationsKeys = [];

    /// Play like sound
    playSound(`${getPackageBaseUrl()}${NEW_LIKE_SOUND_URI}`);
}

function aggregateLikeNotificationData(
    likeNotificationData: LikeNotificationData,
    newNotification: SocialActivityNotificationPayload
) {
    likeNotificationData.actors.unshift(newNotification.Actor);
    likeNotificationData.date = userDate(newNotification.CreatedTimeStamp);
    likeNotificationData.itemId = newNotification.Target.TargetItemId.Id;
}

function hasDuplicateActor(existingLikeNotificationData: LikeNotificationData, actor: PersonaType) {
    return existingLikeNotificationData.actors.some(
        existingActor => getActorKey(existingActor) === getActorKey(actor)
    );
}

function getActorKey(actor: PersonaType) {
    let actorKey = actor.EmailAddress.Name;
    if (!isNullOrWhiteSpace(actor.EmailAddress.EmailAddress)) {
        actorKey += '_' + actor.EmailAddress.EmailAddress;
    }

    return actorKey;
}

function isDocumentActive() {
    return !document.hidden || document.hasFocus();
}
