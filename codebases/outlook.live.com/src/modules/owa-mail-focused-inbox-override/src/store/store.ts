import { createStore } from 'satcheljs';
import type FocusedOverrideStore from './schema/FocusedOverrideStore';
import { ObservableMap } from 'mobx';

const defaultStore: FocusedOverrideStore = {
    inferenceClassificationResultMap: new ObservableMap<string, number>({}),
};
export let getStore = createStore<FocusedOverrideStore>('focusedOverride', defaultStore);

const store = getStore();
export default store;
