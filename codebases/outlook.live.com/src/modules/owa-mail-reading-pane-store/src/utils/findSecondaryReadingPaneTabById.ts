import { getStore as getTabStore, TabType, SecondaryReadingPaneTabViewState } from 'owa-tab-store';

export default function findSecondaryReadingPaneTabById(
    id: string
): SecondaryReadingPaneTabViewState {
    const tabStore = getTabStore();
    for (const tab of tabStore.tabs) {
        if (tab.type !== TabType.SecondaryReadingPane) {
            continue;
        }
        const data = tab.data;
        if (data.id && data.id.Id == id) {
            return tab;
        }
    }
    return null;
}
