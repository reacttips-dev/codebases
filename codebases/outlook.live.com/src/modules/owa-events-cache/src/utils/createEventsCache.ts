import type { EventEntity } from '../schema/EventEntity';
import type { EventsCache } from '../schema/EventsCache';
import { ObservableMap } from 'mobx';

export function createEventsCache<T extends EventEntity>(): EventsCache<T> {
    return {
        events: new ObservableMap(),
        locksInfo: new ObservableMap(),
    };
}
