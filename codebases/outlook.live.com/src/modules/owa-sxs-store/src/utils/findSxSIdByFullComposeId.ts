import { getStore } from '../store/Store';

export default function findSxSIdByFullComposeId(composeId: string): string {
    const sxsStoreMapping = getStore().sxsStoreMapping;
    for (const sxsId of sxsStoreMapping.keys()) {
        const sxsStore = sxsStoreMapping.get(sxsId);
        if (sxsStore.composeId === composeId) {
            return sxsId;
        }
    }
    return null;
}
