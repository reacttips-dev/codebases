import getResizeEventEmitter from './getResizeEventEmitter';
import eventName from './store/schema/eventName';

export default function subscribe(
    callback: () => void,
    key: string = '',
    windowRef: Window = null
): void {
    getResizeEventEmitter(key, windowRef).on(eventName, callback);
}
