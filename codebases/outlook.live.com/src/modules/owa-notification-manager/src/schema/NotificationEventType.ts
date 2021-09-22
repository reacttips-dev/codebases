export type NotificationEventTypeKey =
    | 'ChannelData'
    | 'SubscriptionAdded'
    | 'SubscriptionRemoved'
    | 'SubscriptionUpdated'
    | 'NotificationData'
    | 'TraceWarn'
    | 'TraceError';

export type MappedType<U extends string> = { [K in U]: K };

const NotificationEventType: MappedType<NotificationEventTypeKey> = {
    ChannelData: 'ChannelData',
    SubscriptionAdded: 'SubscriptionAdded',
    SubscriptionRemoved: 'SubscriptionRemoved',
    SubscriptionUpdated: 'SubscriptionUpdated',
    NotificationData: 'NotificationData',
    TraceWarn: 'TraceWarn',
    TraceError: 'TraceError',
};

export default NotificationEventType;
