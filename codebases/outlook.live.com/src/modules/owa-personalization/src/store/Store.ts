import { ObservableMap } from 'mobx';
import type { UsageSuggestion } from './schema/PersonalizationSchema';
import { createStore } from 'satcheljs';
import type PersonalizationStore from './schema/PersonalizationStore';

const initialPersonalizationStore: PersonalizationStore = {
    usageSuggestions: new ObservableMap<string, UsageSuggestion[]>(),
};

export const getStore = createStore<PersonalizationStore>(
    'personalization',
    initialPersonalizationStore
);
const store = getStore();

export default store;
