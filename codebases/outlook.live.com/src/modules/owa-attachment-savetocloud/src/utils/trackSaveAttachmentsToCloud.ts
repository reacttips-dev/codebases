import { subscribeNotificationAndGetChannelId } from 'owa-attachment-web-notification';
import AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import type SaveToCloudNotificationPayload from 'owa-service/lib/contract/SaveToCloudNotificationPayload';
import {
    cancelSaveToCloudProgressManager,
    startSaveToCloudProgressManager,
} from '../orchestrators/saveToCloudProgressManager';
import { DatapointStatus } from 'owa-analytics';
import type { ClientAttachmentId } from 'owa-client-ids';

export async function trackSaveAttachmentsToCloud(
    attachmentId: ClientAttachmentId,
    notificationHandler: (payload: SaveToCloudNotificationPayload) => boolean,
    serviceCallFailureCallback: (
        error: string,
        resultCode: AttachmentResultCode,
        datapointStatus: DatapointStatus,
        sxsId: string
    ) => void,
    subscriptionId: string,
    sxsId: string
) {
    const wrappedNotificationHandler = (payload: SaveToCloudNotificationPayload): boolean => {
        if (!payload || payload.EventType === 'Reload') {
            // We've seen cases of null payload being received here. Apparently it happens when a Reload notification
            // comes from the server. In those cases, we ignore it here and let the saveToCloudProgressManager complete
            // the operation.
            return false;
        }

        if (payload.ResultCode === AttachmentResultCode.Pending) {
            // The operation is still in progress and there is nothing we can do yet so
            // simply return operationComplete = false
            return false;
        }

        const operationComplete = notificationHandler(payload);

        if (operationComplete) {
            cancelSaveToCloudProgressManager(attachmentId.Id);
        }

        return operationComplete;
    };

    await subscribeNotificationAndGetChannelId(wrappedNotificationHandler, subscriptionId);

    // Sometimes the notification comes before the service request response. That's why we
    // track if the progressManager should be created or not.
    startSaveToCloudProgressManager(
        attachmentId,
        null, // itemId
        attachmentId.Id,
        (payloads: SaveToCloudNotificationPayload[]) => {
            payloads.forEach(payload => {
                wrappedNotificationHandler(payload);
            });
        },
        () => {
            serviceCallFailureCallback(
                'Progress manager timeout. OperationId = ' + attachmentId.Id,
                AttachmentResultCode.Timeout,
                DatapointStatus.Timeout,
                sxsId
            );
        }
    );
}
