import eventName from './store/schema/eventName';
import eStore from './store/store';

export default function removeEmitter(key: string): void {
    if (eStore.emitters[key]) {
        eStore.emitters[key].off(eventName, null /* null = delete all */);
        delete eStore.emitters[key];
    }
}
