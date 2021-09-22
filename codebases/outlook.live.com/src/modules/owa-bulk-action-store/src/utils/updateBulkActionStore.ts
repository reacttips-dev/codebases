import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import isBulkActionStale from '../utils/isBulkActionStale';
import type Item from 'owa-service/lib/contract/Item';
import setBulkActionInformation from '../mutators/setBulkActionInformation';
import { BulkActionStateEnum } from '../index';
import type { BulkActionInformation } from '../store/schema/BulkActionStateStore';
import store from '../store/store';

interface BulkActionProperties {
    BulkActionProcessedCount: number;
    BulkActionStartTime: string;
    BulkActionSendTime: string;
    BulkActionState: number;
    BulkActionTargetFolderId: {
        ChangeKey: string;
        Id: string;
        __type: string;
    };
    ItemId: {
        ChangeKey: string;
        Id: string;
        __type: string;
    };
    BulkActionTotalCount: number;
    BulkActionClass: string;
    BulkActionCustomData: string;
    LastModifiedTime: string;
}
/**
 * This is called after boot and after an empty folder action.
 * We need this after boot, to show bulk action items that were in progress before the user refreshed the page.
 * When we empty a folder immediately after boot and before the notification channel is setup,
 * the bulk action notification can get lost in translation
 */
export default function updateBulkActionStore(bulkActionItems: Item[]) {
    for (const bulkActionItem of bulkActionItems) {
        const bulkProps = bulkActionItem as BulkActionProperties;

        const folderId = bulkProps.BulkActionTargetFolderId.Id;

        const bulkActionInfo = store.bulkActionInformationMap.get(folderId);

        /**
         * Ensure we only update with running states and
         * uninitialized folders that completed their actions before the initialization of the notification channel.
         */
        if (
            bulkProps.BulkActionState != BulkActionStateEnum.Running &&
            bulkActionInfo?.state != BulkActionStateEnum.Uninitialized
        ) {
            continue;
        }

        const bulkActionPercentComplete =
            bulkProps.BulkActionProcessedCount / Math.max(1, bulkProps.BulkActionTotalCount);

        const foundBulkActionInformation: BulkActionInformation = {
            id: bulkProps.ItemId.Id,
            targetFolderName: folderIdToName(folderId),
            sendTime: bulkProps.BulkActionSendTime,
            startTime: bulkProps.BulkActionStartTime,
            customData: bulkProps.BulkActionCustomData,
            class: bulkProps.BulkActionClass,
            state: bulkProps.BulkActionState,
            progress: {
                processedCount: bulkProps.BulkActionProcessedCount,
                percentComplete: bulkActionPercentComplete,
                totalCount: bulkProps.BulkActionTotalCount,
            },
        };

        // Update the bulk action find item in the store ONLY if:
        // 1. The bulk action is currently running (above).
        // 2a. The payload does not exists, which can happen if action is running and client freshly booted in OWA.
        // 2b. *OR* The payload is not stale.
        if (!isBulkActionStale(foundBulkActionInformation, folderId)) {
            setBulkActionInformation(folderId, foundBulkActionInformation);
        }
    }
}
