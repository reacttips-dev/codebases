import getNotificationEmitter from '../getNotificationEmitter';
import NotificationEventType from '../schema/NotificationEventType';

export function emitWarn(message: string) {
    getNotificationEmitter().emit(NotificationEventType.TraceWarn, message);
}

export function emitError(message: string) {
    getNotificationEmitter().emit(NotificationEventType.TraceError, message);
}
