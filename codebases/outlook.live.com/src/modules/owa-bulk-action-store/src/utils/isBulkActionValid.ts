import isBulkActionStale from './isBulkActionStale';
import * as trace from 'owa-trace';
import store from '../store/store';

export default function isBulkActionValid(folderId: string) {
    const bulkActionInfo = store.bulkActionInformationMap.get(folderId);

    if (!bulkActionInfo) {
        return false;
    }

    if (bulkActionInfo.customData && !isCustomDataValid(bulkActionInfo.customData)) {
        return false;
    }

    // Make sure we are not checking a stale bulk action item
    if (isBulkActionStale(bulkActionInfo, folderId)) {
        return false;
    }

    return true;
}

function isCustomDataValid(customData: any) {
    let parsedData;
    try {
        parsedData = JSON.parse(customData);
    } catch (error) {
        trace.errorThatWillCauseAlert('Failed to parse bulkActionInfo.customData');
        return false;
    }

    return parsedData !== null && parsedData.Scenario !== null;
}
