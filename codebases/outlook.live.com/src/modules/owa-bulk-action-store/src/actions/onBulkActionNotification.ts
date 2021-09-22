import type BulkActionNotificationPayload from 'owa-service/lib/contract/BulkActionNotificationPayload';
import BulkActionState from 'owa-service/lib/contract/BulkActionState';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import isBulkActionStale from '../utils/isBulkActionStale';
import setBulkActionInformation from '../mutators/setBulkActionInformation';
import type { BulkActionInformation } from '../store/schema/BulkActionStateStore';
import { BulkActionStateEnum } from '../index';
import logBulkActionInformation from '../utils/logBulkActionData';
import getBulkActionProgress from '../selectors/getBulkActionProgress';

const stateTransitions = {
    [BulkActionState.Uninitialized]: BulkActionStateEnum.Uninitialized,
    [BulkActionState.Timeout]: BulkActionStateEnum.Timeout,
    [BulkActionState.Running]: BulkActionStateEnum.Running,
    [BulkActionState.Cancelled]: BulkActionStateEnum.Cancelled,
    [BulkActionState.Complete]: BulkActionStateEnum.Complete,
    [BulkActionState.Failed]: BulkActionStateEnum.Failed,
};

/**
 * @param payload the BulkActionNotificationPayload recieved from server
 * Updates bulkActionState and logs states that result in termination
 */
export default function onBulkActionNotification(payload: BulkActionNotificationPayload) {
    const folderId = payload.BulkActionTargetFolderId;

    // Update processed count if
    // 1) It didn't exist prior (e.g. this is a refresh or concurrent session scenario)
    // 2) It is less than the bulk action payload's processed count (because we don't want progress to decrease)
    const currentProgress = getBulkActionProgress(folderId);
    const bulkActionProcessedCount = payload.BulkActionProcessedCount;
    const currentProcessedCount = currentProgress ? currentProgress.processedCount : 0;
    const newProcessedCount =
        currentProcessedCount < bulkActionProcessedCount
            ? bulkActionProcessedCount
            : currentProcessedCount;
    const bulkActionTotalCount = payload.BulkActionTotalCount;
    const newBulkActionInfomation: BulkActionInformation = {
        class: payload.BulkActionClass,
        customData: payload.BulkActionCustomData,
        id: payload.BulkActionId,
        targetFolderName: folderIdToName(folderId),
        sendTime: payload.BulkActionSendTime,
        startTime: payload.BulkActionStartTime,
        state: stateTransitions[payload.BulkActionState],
        progress: {
            percentComplete: newProcessedCount / bulkActionTotalCount,
            processedCount: Math.min(newProcessedCount, bulkActionTotalCount),
            totalCount: bulkActionTotalCount,
        },
    };

    // Update the bulk action payload in the store ONLY if:
    // The payload is not stale.
    if (!isBulkActionStale(newBulkActionInfomation, folderId)) {
        setBulkActionInformation(folderId, newBulkActionInfomation);
        logBulkActionInformation('TnS_BulkActionDatapoint', newBulkActionInfomation);
    }
}
