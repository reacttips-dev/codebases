export enum ActivityFeedSettingIds {
    unknown = 0,
    likeNotification = 1,
    emailMentionNotification = 2,
    flightNotification = 11,
    parcelNotification = 15,
    documentMentionNotification = 18,
    RealTimeFlightUpdate = 19,
    MyAnalyticsTaskNotificationInsight = 20,
    MyAnalyticsFollowUpNotificationInsight = 21,
    OutOfRoutineNotification = 22,
    Reactions = 24,
}

export interface ActivityFeedSettingsResponse {
    name: string;
    value: string;
    timestamp: number;
}

export enum ActivityFeedTypeIds {
    Unknown = 0,
    Like = 1,
    AtMention = 2,
    TxpFlightReservation = 11,
    TxpParcelDelivery = 15,
    UserAtMentioned = 18,
    RealTimeFlightUpdate = 19,
    TaskNotificationInsight = 20,
    FollowUpNotificationInsight = 21,
    OutOfRoutineNotificationInsight = 22,
    Reactions = 24,
    CommentCreated = 25,
    TaskCreated = 26,
    TaskCompleted = 27,
    TaskReassigned = 28,
    TaskReopened = 29,
}

export let SettingIdsToActivityTypeMapping = new Map<
    ActivityFeedSettingIds,
    Array<ActivityFeedTypeIds>
>([
    [ActivityFeedSettingIds.unknown, [ActivityFeedTypeIds.Unknown]],
    [ActivityFeedSettingIds.likeNotification, [ActivityFeedTypeIds.Like]],
    [ActivityFeedSettingIds.emailMentionNotification, [ActivityFeedTypeIds.AtMention]],
    [ActivityFeedSettingIds.flightNotification, [ActivityFeedTypeIds.TxpFlightReservation]],
    [ActivityFeedSettingIds.parcelNotification, [ActivityFeedTypeIds.TxpParcelDelivery]],
    [
        ActivityFeedSettingIds.documentMentionNotification,
        [
            ActivityFeedTypeIds.UserAtMentioned,
            ActivityFeedTypeIds.CommentCreated,
            ActivityFeedTypeIds.TaskCreated,
            ActivityFeedTypeIds.TaskCompleted,
            ActivityFeedTypeIds.TaskReopened,
            ActivityFeedTypeIds.TaskReassigned,
        ],
    ],
    [ActivityFeedSettingIds.RealTimeFlightUpdate, [ActivityFeedTypeIds.RealTimeFlightUpdate]],
    [
        ActivityFeedSettingIds.MyAnalyticsTaskNotificationInsight,
        [ActivityFeedTypeIds.TaskNotificationInsight],
    ],
    [
        ActivityFeedSettingIds.MyAnalyticsFollowUpNotificationInsight,
        [ActivityFeedTypeIds.FollowUpNotificationInsight],
    ],
    [
        ActivityFeedSettingIds.OutOfRoutineNotification,
        [ActivityFeedTypeIds.OutOfRoutineNotificationInsight],
    ],
    [ActivityFeedSettingIds.Reactions, [ActivityFeedTypeIds.Reactions]],
]);
