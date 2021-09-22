import addReactionNotification from '../mutators/addReactionNotification';
import { getPackageBaseUrl } from 'owa-config';
import removeReactionNotification from '../mutators/removeReactionNotification';
import UserSocialActivityActionType from 'owa-service/lib/contract/UserSocialActivityActionType';
import { userDate } from 'owa-datetime';
import type { ReactionNotificationData } from '../store/schema/ReactionNotificationData';
import { orchestrator } from 'satcheljs';
import { playSound } from 'owa-audio';
import {
    reactionNotificationAction,
    SocialActivityNotificationPayload,
} from 'owa-app-notifications-core';
import { shouldNewReactionNotificationBeFiltered } from '../utils/newReactionNotificationFilter';
import { lazyLoadActivityFeed } from 'owa-activity-feed';
import isReactionToastEnabled from '../selectors/isReactionToastEnabled';
import isReactionSoundEnabled from '../selectors/isReactionSoundEnabled';

export const REACTION_NOTIFICATION_TIMEOUT = 5000; //5s to dismiss reaction notification
export const NEW_REACTION_SOUND_URI = 'resources/sounds/notifications/socialactivity.mp3';

export default orchestrator(reactionNotificationAction, message => {
    const notification = message.notification as SocialActivityNotificationPayload;
    if (
        notification.EventType === 'Reload' ||
        shouldNewReactionNotificationBeFiltered(notification)
    ) {
        return;
    }

    // We only care about reactions notification
    if (notification.Action !== UserSocialActivityActionType.Reaction) {
        return;
    }

    const reactionNotificationData: ReactionNotificationData = {
        actor: notification.Actor,
        subject: notification.Target.TargetSubject,
        preview: notification.Metadata.MessagePreview,
        conversationId: notification.Target.TargetConversationId.Id,
        itemId: notification.Target.TargetItemId.Id,
        date: userDate(notification.CreatedTimeStamp),
        targetLogicalId: notification.Target.TargetLogicalId,
        reactionType: notification.Metadata.NotificationPayload,
        mailboxGuid: notification.Target.TargetMailboxGuid,
    };

    if (isReactionToastEnabled()) {
        addReactionNotification(reactionNotificationData);
        setTimeout(
            () => removeReactionNotification(reactionNotificationData),
            REACTION_NOTIFICATION_TIMEOUT
        );
    }

    if (isReactionSoundEnabled()) {
        /// Play reaction sound
        playSound(`${getPackageBaseUrl()}${NEW_REACTION_SOUND_URI}`);
    }

    /// Auto refresh Activity Feed.
    lazyLoadActivityFeed.importAndExecute();
});
