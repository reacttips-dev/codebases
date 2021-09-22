import {
    GroupSubscriptionType,
    GroupSubscriptionProperties,
} from '../schema/GroupSubscriptionType';
import UnifiedGroupSubscriptionType from 'owa-service/lib/contract/UnifiedGroupSubscriptionType';

export function mapSubscriptionTypeToProperties(
    groupSubscriptionType: GroupSubscriptionType
): GroupSubscriptionProperties {
    switch (groupSubscriptionType) {
        case GroupSubscriptionType.All:
            return {
                SubscriptionType: UnifiedGroupSubscriptionType.All,
                ShouldIgnoreReply: false,
                IsSubscribed: true,
            };
        case GroupSubscriptionType.RepliesAndEvents:
            return {
                SubscriptionType: UnifiedGroupSubscriptionType.Calendar,
                ShouldIgnoreReply: false,
                IsSubscribed: false,
            };
        case GroupSubscriptionType.RepliesOnly:
            return {
                // Do not set this to UnifiedGroupSubscriptionType.Message.
                // ShouldIgnoreReply is the property that controls between getting replies or getting nothing.
                SubscriptionType: UnifiedGroupSubscriptionType.None,
                ShouldIgnoreReply: false,
                IsSubscribed: false,
            };
        case GroupSubscriptionType.None:
            return {
                SubscriptionType: UnifiedGroupSubscriptionType.None,
                ShouldIgnoreReply: true,
                IsSubscribed: false,
            };
    }
}

export function mapSubscriptionPropertiesToType(
    subscriptionProperties: GroupSubscriptionProperties
): GroupSubscriptionType {
    const { SubscriptionType, ShouldIgnoreReply } = subscriptionProperties;
    switch (SubscriptionType) {
        case UnifiedGroupSubscriptionType.All:
            return GroupSubscriptionType.All;
        case UnifiedGroupSubscriptionType.Calendar:
            return GroupSubscriptionType.RepliesAndEvents;
        case UnifiedGroupSubscriptionType.None:
            return ShouldIgnoreReply
                ? GroupSubscriptionType.None
                : GroupSubscriptionType.RepliesOnly;

        /* This is in the case that someone was previously using React and set their subscription type to replies only.
        We were incorrectly setting the subscription type to message in that case, so we should probably handle that here for now */
        case UnifiedGroupSubscriptionType.Message:
            return GroupSubscriptionType.RepliesOnly;
    }
}
