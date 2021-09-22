import { getActiveContentTab } from 'owa-tab-store';
import { getStore } from '../store/Store';

export default function isAnySxSVisibleInMainWindow(): boolean {
    const sxsId = getActiveContentTab().sxsId;
    if (!getStore().sxsStoreMapping.has(sxsId)) {
        return false;
    }
    const store = getStore().sxsStoreMapping.get(sxsId);
    return !store.isInvisible;
}
