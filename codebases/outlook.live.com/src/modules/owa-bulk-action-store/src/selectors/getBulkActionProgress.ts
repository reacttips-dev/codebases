import { getStore } from '../store/store';

export default function getBulkActionProgress(folderId: string) {
    const bulkActionInfo = getStore().bulkActionInformationMap.get(folderId);
    return bulkActionInfo ? bulkActionInfo.progress : null;
}
