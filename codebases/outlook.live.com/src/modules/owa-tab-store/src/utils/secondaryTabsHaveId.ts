import type SecondaryReadingPaneTabData from '../store/schema/SecondaryReadingPaneTabData';
import { TabType } from '../store/schema/TabViewState';
import { getStore } from '../store/tabStore';

export default function secondaryTabsHaveId(id: string): boolean {
    const store = getStore();
    for (const tab of store.tabs) {
        if (
            tab.type !== TabType.Primary &&
            tab.type !== TabType.SxS &&
            (tab.data as SecondaryReadingPaneTabData)?.id?.Id == id
        ) {
            return true;
        }
    }
    return false;
}
