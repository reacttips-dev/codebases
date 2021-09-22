import { createStore } from 'satcheljs';
import type { LightningState, LightningUnseenItem } from './schema/LightningState';
import { ObservableMap } from 'mobx';

export let getStore = createStore<LightningState>('lightningState', {
    unseenItems: new ObservableMap<string, LightningUnseenItem>(),
    lightedCount: 0,
    lastShownId: null,
});

export let store = getStore();
