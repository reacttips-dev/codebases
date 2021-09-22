import eventName from './store/schema/eventName';
import EventEmitter from 'owa-event-emitter';
import eStore from './store/store';

export default function getNotificationEmitter(
    key: string,
    windowRef: Window = null
): EventEmitter {
    if (!eStore.emitters[key]) {
        let emitter = new EventEmitter();
        eStore.emitters[key] = emitter;
        (windowRef || window).addEventListener('resize', () => {
            eStore.emitters[key].emit(eventName);
        });
    }

    return eStore.emitters[key];
}
