import SkypeNotificationType from '../data/store/schema/SkypeNotificationType';

export enum NotificationAllowedValue {
    All = 'ALL',
    Notification = 'NOTIFICATION',
    Off = 'OFF',
}
export enum NotificationSettingType {
    IncomingCall = 'swc.notification.incoming-call',
    NewMessage = 'swc.notification.new-message',
}
export interface ISettingsNotificationOption {
    name: NotificationSettingType;
    value: NotificationAllowedValue;
}
export function convertSwcSettingTypeToOws(
    notificationType: NotificationAllowedValue
): SkypeNotificationType {
    switch (notificationType) {
        case NotificationAllowedValue.Off:
            return SkypeNotificationType.None;
        case NotificationAllowedValue.Notification:
            return SkypeNotificationType.ToastOnly;
        case NotificationAllowedValue.All:
            return SkypeNotificationType.ToastAndSound;
        default:
            return SkypeNotificationType.ToastAndSound;
    }
}

export function convertOwsSettingTypeToSwc(
    notificationType: SkypeNotificationType
): NotificationAllowedValue {
    switch (notificationType) {
        case SkypeNotificationType.None:
            return NotificationAllowedValue.Off;
        case SkypeNotificationType.ToastOnly:
            return NotificationAllowedValue.Notification;
        case SkypeNotificationType.ToastAndSound:
            return NotificationAllowedValue.All;
        default:
            return NotificationAllowedValue.All;
    }
}
