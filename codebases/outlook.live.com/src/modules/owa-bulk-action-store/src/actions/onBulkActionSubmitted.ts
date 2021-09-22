import BulkActionStateEnum from '../store/schema/BulkActionStateEnum';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import setBulkActionInformation from '../mutators/setBulkActionInformation';
import type { BulkActionInformation } from '../store/schema/BulkActionStateStore';
import { now, getISOString } from 'owa-datetime';

export default function onBulkActionSubmitted(
    targetFolderId: string,
    className: string,
    customData?: any,
    totalCount?: number
) {
    const newBulkActionState: BulkActionInformation = {
        id: '',
        targetFolderName: folderIdToName(targetFolderId),
        startTime: '',
        // We want to set a send time when we locally update the store so the bulk action will be marked valid and not stale.
        sendTime: getISOString(now()),
        class: className,
        customData: customData ? JSON.stringify(customData) : '',
        state: BulkActionStateEnum.Uninitialized,
        progress: {
            percentComplete: 0,
            processedCount: 0,
            totalCount: totalCount,
        },
    };

    setBulkActionInformation(targetFolderId, newBulkActionState);
}
