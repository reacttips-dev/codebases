/*
Duplicated here from owa-notification-manager because this actually generates code.
If we had something like const string enums, we could export this from the
owa-sync-notification package without issue.

If we export from owa-notification-manager as-is, the generated code causes
webpack to not build a separate owa.notification.js bundle.

This *should* be fixed when TS 2.4 releases with string enums.

VSO: 15314
*/

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
