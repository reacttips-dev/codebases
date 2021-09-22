export enum NotificationActionType {
    AsyncSendFailed,
    AddFavoritePersonaFailedNotification,
    RemoveFavoritePersonaFailedNotification,
    PeopleHubNotification,
    SkypeNotification,
    SkypeForBusinessNotification,
}

interface NotificationViewState {
    id: number;
    actionType: NotificationActionType;
    title: string;
    description: string;
    actionLink: string;
    cancelLink?: string;
    image?: string;
    actionContext?: any;
    ignore?: boolean;
    timedOut?: boolean;
}

export default NotificationViewState;
