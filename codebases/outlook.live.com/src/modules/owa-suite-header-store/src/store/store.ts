import { createStore } from 'satcheljs';

interface SuiteHeaderStore {
    isRendered: boolean;
    isShy: boolean;
    isFlexPaneShown: boolean;
}

export const getStore = createStore<SuiteHeaderStore>('suiteHeaderStore', {
    isRendered: false,
    isShy: false,
    isFlexPaneShown: false,
});
