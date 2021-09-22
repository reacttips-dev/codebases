import type { ComposeStore } from './schema/ComposeStore';
import type { ComposeViewState } from './schema/ComposeViewState';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const composeStoreData: ComposeStore = {
    viewStates: new ObservableMap<string, ComposeViewState>(),
    primaryComposeId: null,
    newMessageCreationInProgress: false,
};

export const getStore = createStore<ComposeStore>('compose', composeStoreData);

export const composeStore = getStore();
