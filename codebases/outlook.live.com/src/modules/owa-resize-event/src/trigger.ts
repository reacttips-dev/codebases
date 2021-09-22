import getResizeEventEmitter from './getResizeEventEmitter';
import eventName from './store/schema/eventName';

export default function trigger(key: string = ''): void {
    getResizeEventEmitter(key).emit(eventName);
}
