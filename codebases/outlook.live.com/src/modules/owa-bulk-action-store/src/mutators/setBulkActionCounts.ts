import type * as Schema from 'owa-graph-schema';
import type { BulkActionInformation } from '../store/schema/BulkActionStateStore';
import { BulkActionStateEnum } from '../index';
import { getStore } from '../store/store';
import { mutatorAction } from 'satcheljs';

/**
 * @param folderId the folder id
 * Updates the bulk action store w/ data from hierarchy notification
 */
export default mutatorAction(
    'setBulkActionCounts',
    function setBulkActionCounts(payload: Schema.HierarchyNotificationPayload) {
        const currentBulkActionInfo: BulkActionInformation = getStore().bulkActionInformationMap.get(
            payload.folderId
        );

        // Since this function is called for every row delete hierarchy notification, we need to check
        // that there is a bulk action running before we update the progress. Row delete notifications
        // can be caused by actions other than empty folder
        if (!currentBulkActionInfo || currentBulkActionInfo.state != BulkActionStateEnum.Running) {
            return;
        }

        // Retrieve progress from store
        const currentProgress = currentBulkActionInfo.progress;

        /**
         * Offset: BulkAction's total count - Hierarchy's total count
         *
         * Extended comment: Hierarchy is trusted as the most recent source of truth when dealing with
         * folder size. Thus, for each hierarchy notification at worst we will extend the life of the
         * progress bar (ex: in the event that items move to this folder as emptying is performed).
         * This is acceptable as we will still recieve the end state from BulkAction's final payload.
         *
         * Additionally: We want to ensure progress is only INCREASING even if more items move to this folder while
         * emptying (for UI consistency). The || 0 is to avoid the possibility of itemCount not being defined.
         */
        const totalCountDifference = currentProgress.totalCount - payload.itemCount;
        currentProgress.processedCount = Math.max(
            Math.min(currentProgress.processedCount, currentProgress.totalCount),
            totalCountDifference || 0
        );

        if (currentProgress.processedCount > currentProgress.totalCount) {
            currentProgress.totalCount = currentProgress.processedCount;
        }
        currentProgress.percentComplete =
            currentProgress.processedCount / Math.max(1, currentProgress.totalCount);
    }
);
