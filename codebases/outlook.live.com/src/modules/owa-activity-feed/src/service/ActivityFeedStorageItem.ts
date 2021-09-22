export enum ActivityType {
    Unknown = 'Unknown',
    Like = 'Like',
    AtMention = 'AtMention',
    GroupMention = 'GroupMention',
    MeMention = 'MeMention',
    FileMention = 'FileMention',
    GroupAtAllMention = 'GroupAtAllMention',
    TxpRentalCarReservation = 'TxpRentalCarReservation',
    TxpFlightReservation = 'TxpFlightReservation',
    TxpLodgingReservation = 'TxpLodgingReservation',
    TxpFoodEstablishmentReservation = 'TxpFoodEstablishmentReservation',
    TxpEventReservation = 'TxpEventReservation',
    TxpParcelDelivery = 'TxpParcelDelivery',
    TxpInvoice = 'TxpInvoice',
    TxpServiceReservation = 'TxpServiceReservation',
    UserAtMentioned = 'UserAtMentioned',
    TaskNotificationInsight = 'TaskNotificationInsight',
    FollowUpNotificationInsight = 'FollowUpNotificationInsight',
    OutOfRoutineNotificationInsight = 'OutOfRoutineNotificationInsight',
    RealTimeFlightUpdate = 'RealTimeFlightUpdate',
    YammerLiveEventNotification = 'YammerLiveEventNotification',
    Reactions = 'Reactions',
    CommentCreated = 'CommentCreated',
    TaskCreated = 'TaskCreated',
    TaskCompleted = 'TaskCompleted',
    TaskReassigned = 'TaskReassigned',
    TaskReopened = 'TaskReopened',
}

// ActivityStateFlags are defined in server-ows-api. Please keep in sync with
// https://outlookweb.visualstudio.com/Outlook%20Web/_git/server-ows-api?
// path=%2Fsrc%2FMicrosoft.OWS.ActivityFeed%2FModels%2FActivityStateFlags.cs
export enum ActivityStateFlags {
    /// No flags
    None = 0,
    /// Activity Feed Item is marked as dismissed.
    /// Set when the user has explicitly dismisses the Activity Feed Item.
    IsDismissed = 1 << 0,
    /// Activity Feed Item is marked as seen.
    /// Set when the Activity Feed Item has been shown to the user.
    IsSeen = 1 << 1,
    /// Activity Feed Item is marked as read.
    /// Set when the user has explicitly clicks the Activity Feed Item.
    IsRead = 1 << 2,
    // Activity Feed Item is marked as completed.
    IsCompleted = 1 << 3,
    /// Activity Feed Item is marked as important.
    IsFlagged = 1 << 4,
}

export interface ActivityFeedV2StorageItem {
    id: string;
    type: ActivityType;
    collectionId: string;
    activityState: ActivityStateFlags;
    activityFeedItemPayload: string;
    timestamp: Date;
}

export interface ActivityFeedV1StorageItem {
    id: string;
    type: ActivityType;
    isSeen: boolean;
    isRead: boolean;
    isDismissed: boolean;
    activityFeedItemPayload: string;
    timestamp: Date;
}

export type ActivityFeedStorageItem = ActivityFeedV1StorageItem | ActivityFeedV2StorageItem;
