import type { DatapointStatus } from 'owa-analytics';
import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';
import type { NotificationCallback, NotificationSubscription } from 'owa-notification';
import type AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import type SaveToCloudNotificationPayload from 'owa-service/lib/contract/SaveToCloudNotificationPayload';
import { action } from 'satcheljs';

export const enum SaveToCloudStatus {
    disabled,
    available,
    saving,
    succeeded,
    failed,
}

export type ServiceCallFailureCallback = (
    error: string,
    resultCode: AttachmentResultCode,
    datapointStatus: DatapointStatus,
    sxsId: string
) => void;

export type OperationCreatedCallback = (
    operationId: string,
    notificationSubscription: NotificationSubscription,
    notificationCallback: NotificationCallback
) => void;

export type NotificationHandler = (notification: SaveToCloudNotificationPayload) => boolean;

export interface SaveAttachmentsToCloudActionMessage {
    attachmentId: ClientAttachmentId | null;
    itemId: ClientItemId | null;
    sxsId: string;
    notificationHandler: NotificationHandler;
    serviceCallFailureCallback: ServiceCallFailureCallback;
    operationCreatedCallback: OperationCreatedCallback | null;
    folderId?: string | null;
    attachmentIds?: ClientAttachmentId[] | null;
    showProgressBar?: boolean | null;
    subscriptionId?: string | null;
}

export function saveAttachmentsToCloud(
    attachmentId: ClientAttachmentId,
    itemId: null,
    sxsId: string,
    notificationHandler: NotificationHandler,
    serviceCallFailureCallback: ServiceCallFailureCallback,
    operationCreatedCallback?: null,
    folderId?: null,
    attachmentIds?: null,
    showProgressBar?: false,
    subscriptionId?: string
): SaveAttachmentsToCloudActionMessage;
export function saveAttachmentsToCloud(
    attachmentId: ClientAttachmentId,
    itemId: null,
    sxsId: string,
    notificationHandler: NotificationHandler,
    serviceCallFailureCallback: ServiceCallFailureCallback,
    operationCreatedCallback?: OperationCreatedCallback,
    folderId?: string | null,
    attachmentIds?: ClientAttachmentId[] | null,
    showProgressBar?: null,
    subscriptionId?: null
): SaveAttachmentsToCloudActionMessage;
export function saveAttachmentsToCloud(
    attachmentId: null,
    itemId: ClientItemId,
    sxsId: string,
    notificationHandler: NotificationHandler,
    serviceCallFailureCallback: ServiceCallFailureCallback,
    operationCreatedCallback?: OperationCreatedCallback,
    folderId?: string | null,
    attachmentIds?: ClientAttachmentId[] | null,
    showProgressBar?: null,
    subscriptionId?: null
): SaveAttachmentsToCloudActionMessage;
export function saveAttachmentsToCloud(
    attachmentId: ClientAttachmentId | null,
    itemId: null,
    sxsId: string,
    notificationHandler: NotificationHandler,
    serviceCallFailureCallback: ServiceCallFailureCallback,
    operationCreatedCallback: OperationCreatedCallback,
    folderId: string,
    attachmentIds: ClientAttachmentId[] | null,
    showProgressBar?: boolean,
    subscriptionId?: null
): SaveAttachmentsToCloudActionMessage;
export function saveAttachmentsToCloud(
    attachmentId: ClientAttachmentId | null,
    itemId: ClientItemId | null,
    sxsId: string,
    notificationHandler: NotificationHandler,
    serviceCallFailureCallback: ServiceCallFailureCallback | null,
    operationCreatedCallback: OperationCreatedCallback | null,
    folderId?: string | null,
    attachmentIds?: ClientAttachmentId[] | null,
    showProgressBar?: boolean | null,
    subscriptionId?: string | null
): SaveAttachmentsToCloudActionMessage {
    return {
        attachmentId: attachmentId,
        itemId: itemId,
        sxsId: sxsId,
        notificationHandler: notificationHandler,
        serviceCallFailureCallback: serviceCallFailureCallback,
        operationCreatedCallback: operationCreatedCallback,
        folderId: folderId,
        attachmentIds: attachmentIds,
        showProgressBar: showProgressBar,
        subscriptionId: subscriptionId,
    };
}

export default action('saveAttachmentsToCloud', saveAttachmentsToCloud);
