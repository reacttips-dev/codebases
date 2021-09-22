import type CheckPermissionStatus from '../store/schema/CheckPermissionStatus';
import { getStore } from '../store/store';

export function getPendingPermissionState(composeId: string): CheckPermissionStatus {
    const blockOnSendAttachmentData = getStore().BlockOnSendAttachments.get(composeId);
    return blockOnSendAttachmentData?.checkPermissionStatus;
}
