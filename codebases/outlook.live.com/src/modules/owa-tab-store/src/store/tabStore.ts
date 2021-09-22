import type TabStore from './schema/TabStore';
import { TabType, PrimaryReadingPaneTabViewState, TabState } from './schema/TabViewState';
import { createStore } from 'satcheljs';

const primaryTabInitialState: PrimaryReadingPaneTabViewState = {
    id: 'primaryTab',
    type: TabType.Primary,
    state: TabState.Active,
    blink: false,
    sxsId: 'primaryTab',
};

const tabStoreData: TabStore = {
    tabs: [primaryTabInitialState],
    tabBarWidth: 0,
    isOverflowMenuShown: false,
};

export let getStore = createStore<TabStore>('tab', tabStoreData);

const tabStore = getStore();
export default tabStore;

// Export the reference from the store (http://aka.ms/mobx4)
export const primaryTab = getStore().tabs[0];
