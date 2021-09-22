import EventEmitter from 'owa-event-emitter';
import NotificationEventType from './schema/NotificationEventType';

let emitter: EventEmitter;

export default function getNotificationEmitter(): EventEmitter {
    if (!emitter) {
        emitter = new EventEmitter();
    }

    return emitter;
}

export function emitChannelDataEvent(s: string): void {
    getNotificationEmitter().emit(NotificationEventType.ChannelData, s);
}
