import type TabViewState from '../store/schema/TabViewState';
import { getStore } from '../store/tabStore';

export default function getTabById(tabId: string): TabViewState {
    if (tabId) {
        const store = getStore();
        for (const tab of store.tabs) {
            if (tab.id == tabId) {
                return tab;
            }
        }
    }

    return null;
}
