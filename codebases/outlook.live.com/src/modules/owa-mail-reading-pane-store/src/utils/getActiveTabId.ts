import { getActiveContentTab, TabType } from 'owa-tab-store';
import getPrimaryTabId from './getPrimaryTabId';

export default function getActiveTabId(): string {
    const activeTabViewState = getActiveContentTab();

    switch (activeTabViewState.type) {
        case TabType.SecondaryReadingPane:
            return activeTabViewState.data.id.Id;
        case TabType.Primary:
        default:
            // Return the primary tab id if active tab is not RP tab
            return getPrimaryTabId();
    }
}
