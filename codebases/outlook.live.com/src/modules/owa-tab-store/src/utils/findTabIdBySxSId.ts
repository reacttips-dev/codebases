import { getStore } from '../store/tabStore';

export default function findTabIdBySxSId(sxsId: string): string {
    const store = getStore();

    for (const tab of store.tabs) {
        if (tab.sxsId === sxsId) {
            return tab.id;
        }
    }

    return null;
}
