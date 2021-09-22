import saveAttachmentsToCloud, {
    SaveAttachmentsToCloudActionMessage,
} from '../actions/saveAttachmentsToCloud';
import saveAttachmentsToCloudService from '../services/saveAttachmentsToCloud';
import { subscribeNotificationAndGetChannelId } from 'owa-attachment-web-notification';
import { lazyUnsubscribe, NotificationCallback, NotificationSubscription } from 'owa-notification';
import AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import type SaveToCloudNotificationPayload from 'owa-service/lib/contract/SaveToCloudNotificationPayload';
import { orchestrator } from 'satcheljs';
import {
    cancelSaveToCloudProgressManager,
    startSaveToCloudProgressManager,
} from './saveToCloudProgressManager';
import { DatapointStatus } from 'owa-analytics';
import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';

export default orchestrator(
    saveAttachmentsToCloud,
    async (actionMessage: SaveAttachmentsToCloudActionMessage) => {
        let startProgressManager = actionMessage.showProgressBar !== false;
        let operationId = actionMessage.attachmentId || actionMessage.itemId;
        if (!operationId && actionMessage.attachmentIds.length > 0) {
            operationId = actionMessage.attachmentIds[0];
        }
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

            const operationComplete = actionMessage.notificationHandler(payload);

            if (startProgressManager && operationComplete) {
                cancelSaveToCloudProgressManager(operationId.Id);
                startProgressManager = false;
            }

            return operationComplete;
        };

        const existingSubscriptionId = actionMessage.subscriptionId;

        const [
            subscriptionId,
            subscription,
            handleAttachmentNofication,
            channelId,
        ] = await subscribeNotificationAndGetChannelId(
            wrappedNotificationHandler,
            existingSubscriptionId
        );

        // Initially I though of starting the progressManager only when this service request returned. But I have seen
        // cases where it will not return but the saveToCloud operation was actually dispatched. In those cases, the progress
        // manager will be able to properly complete the STC operation sucessfully with no impact to the user.
        invokeSaveAttachmentsToCloudService(
            actionMessage.attachmentId,
            actionMessage.itemId,
            subscriptionId,
            subscription,
            handleAttachmentNofication,
            channelId,
            actionMessage.sxsId,
            actionMessage.serviceCallFailureCallback,
            actionMessage.folderId,
            actionMessage.attachmentIds
        );

        if (startProgressManager) {
            // Sometimes the notification comes before the service request response. That's why we
            // track if the progressManager should be created or not.
            startSaveToCloudProgressManager(
                actionMessage.attachmentId,
                actionMessage.itemId,
                operationId.Id,
                (payloads: SaveToCloudNotificationPayload[]) => {
                    payloads.forEach(payload => {
                        wrappedNotificationHandler(payload);
                    });
                },
                () => {
                    actionMessage.serviceCallFailureCallback(
                        'Progress manager timeout. OperationId = ' + operationId,
                        AttachmentResultCode.Timeout,
                        DatapointStatus.Timeout,
                        actionMessage.sxsId
                    );
                }
            );
        }

        if (actionMessage.operationCreatedCallback) {
            actionMessage.operationCreatedCallback(
                operationId.Id,
                subscription,
                handleAttachmentNofication
            );
        }
    }
);

async function invokeSaveAttachmentsToCloudService(
    attachmentId: ClientAttachmentId | null,
    itemId: ClientItemId | null,
    subscriptionId: string,
    subscription: NotificationSubscription,
    handleAttachmentNofication: NotificationCallback,
    channelId: string,
    sxsId: string,
    serviceCallFailureCallback: (
        error: string,
        resultCode: AttachmentResultCode,
        datapointStatus: DatapointStatus,
        sxsId: string
    ) => void,
    folderId?: string | null,
    attachmentIds?: ClientAttachmentId[] | null
): Promise<string> {
    // Invoke SaveToCloud. Here we would either have attachmentId or itemId.
    // If we have attachmentId then save to cloud will happen only for that single attachment.
    // If we have itemId then it will save to cloud all the attachments in that item.
    try {
        // disabling tslint rule as we need to await here
        // for the catch block to work properly
        // https://github.com/palantir/tslint/issues/3933
        // tslint:disable-next-line:no-return-await
        return await saveAttachmentsToCloudService(
            attachmentId ? attachmentId.Id : null,
            itemId ? itemId.Id : null,
            subscriptionId,
            channelId,
            getMailboxInfo(itemId, attachmentId, attachmentIds),
            folderId,
            attachmentIds ? attachmentIds.map(attachmentId => attachmentId.Id) : null
        );
    } catch (error) {
        serviceCallFailureCallback(
            error,
            AttachmentResultCode.GenericFailure,
            DatapointStatus.ServerError,
            sxsId
        );
        lazyUnsubscribe.importAndExecute(subscription, handleAttachmentNofication);
        return null;
    }
}

function getMailboxInfo(
    itemId: ClientItemId,
    attachmentId: ClientAttachmentId,
    attachmentIds: ClientAttachmentId[]
) {
    if (itemId) {
        return itemId.mailboxInfo;
    } else if (attachmentId) {
        return attachmentId.mailboxInfo;
    } else {
        return attachmentIds[0].mailboxInfo;
    }
}
