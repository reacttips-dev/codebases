import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type { ClientItemId } from 'owa-client-ids';
import type { EventsCacheLockId } from 'owa-calendar-events-loader';

interface UpNextEventIds {
    scenarios: ObservableMap<EventsCacheLockId, ClientItemId | null>;
}
const upNextStoreData: UpNextEventIds = {
    scenarios: new ObservableMap(),
};

export const getUpNextStore = createStore<UpNextEventIds>('UpNextStore', upNextStoreData);
