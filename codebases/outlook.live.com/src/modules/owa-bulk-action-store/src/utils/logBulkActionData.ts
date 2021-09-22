import type { BulkActionInformation } from '../store/schema/BulkActionStateStore';
import { logUsage } from 'owa-analytics';

/**
 * Currently supported datapoint event names
 * - TnS_BulkActionDatapoint
 * - TnS_BulkActionCancelDatapoint
 * - TnS_BulkActionDismissDatapoint
 */

const bulkActionInformationData = (
    id: string,
    folderName: string,
    startTime: string,
    sendTime: string,
    state: number,
    processedCount: number,
    totalCount: number,
    percentComplete: number
) => [id, folderName, startTime, sendTime];

export default function logBulkActionInformation(
    eventName: string,
    bulkActionInformation: BulkActionInformation
) {
    logUsage(
        eventName,
        bulkActionInformationData(
            bulkActionInformation.id,
            bulkActionInformation.targetFolderName,
            bulkActionInformation.startTime,
            bulkActionInformation.sendTime,
            bulkActionInformation.state,
            bulkActionInformation.progress.processedCount,
            bulkActionInformation.progress.totalCount,
            bulkActionInformation.progress.percentComplete
        )
    );
}
