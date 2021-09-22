import { getStore } from '../store/tabStore';
import getTabIdFromProjection from 'owa-popout-v2/lib/utils/getTabIdFromProjection';

export default function getSxSIdFromProjection(targetWindow: Window): string | null {
    const tabId: string = getTabIdFromProjection(targetWindow);
    if (tabId) {
        const store = getStore();
        for (const tab of store.tabs) {
            if (tab.id === tabId) {
                return tab.sxsId;
            }
        }
    }

    return null;
}
