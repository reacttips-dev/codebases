import { createStore } from 'satcheljs';
import type SubstrateSuggestionsStore from './schema/SubstrateSuggestionsStore';

const initialSubstrateSuggestionsStore: SubstrateSuggestionsStore = {
    sessionMaskedRecipients: [],
};
export const getStore = createStore<SubstrateSuggestionsStore>(
    'substratepeoplesuggestions',
    initialSubstrateSuggestionsStore
);

const store = getStore();
export default store;
