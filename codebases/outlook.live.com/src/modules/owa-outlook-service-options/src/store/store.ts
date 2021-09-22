import { createStore } from 'satcheljs';

export enum LoadState {
    OptionsNotLoaded,
    OptionsLoading,
    OptionsLoaded,
}

export interface OwsOptionsLoadStateStore {
    loadState: LoadState;
}

const defaultStore: OwsOptionsLoadStateStore = {
    loadState: LoadState.OptionsNotLoaded,
};

export const getOptionsLoadState = createStore('owsOptionsLoadStateStore', defaultStore);
