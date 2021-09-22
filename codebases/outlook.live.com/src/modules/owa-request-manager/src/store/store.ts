import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

interface RequestData {
    requestId: number;
    timer: NodeJS.Timer | null;
}

interface CurrentRequestCheckerStore {
    currentRequest: ObservableMap<string, RequestData>;
}

const currentRequestCheckerStore: CurrentRequestCheckerStore = {
    currentRequest: new ObservableMap(),
};

export let store = createStore<CurrentRequestCheckerStore>(
    'requestIdStore',
    currentRequestCheckerStore
);
