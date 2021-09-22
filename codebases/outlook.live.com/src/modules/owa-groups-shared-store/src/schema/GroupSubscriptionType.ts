import type UnifiedGroupSubscriptionType from 'owa-service/lib/contract/UnifiedGroupSubscriptionType';

export enum GroupSubscriptionType {
    All,
    RepliesAndEvents,
    RepliesOnly,
    None,
}

export interface GroupSubscriptionProperties {
    SubscriptionType: UnifiedGroupSubscriptionType;
    ShouldIgnoreReply: boolean;
    IsSubscribed: boolean;
}
