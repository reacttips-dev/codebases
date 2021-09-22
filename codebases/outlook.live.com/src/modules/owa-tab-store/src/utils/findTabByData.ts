import TabViewState, { TabType } from '../store/schema/TabViewState';
import { getStore } from '../store/tabStore';

export default function findTabByData(data: any): TabViewState {
    const store = getStore();

    for (const tab of store.tabs) {
        if (tab.type !== TabType.Primary && tab.type !== TabType.SxS && tab.data == data) {
            return tab;
        }
    }

    return null;
}
