import getResizeEventEmitter from './getResizeEventEmitter';
import eventName from './store/schema/eventName';

export default function unSubscribe(callback: () => void, key: string = ''): void {
    getResizeEventEmitter(key).off(eventName, callback);
}
