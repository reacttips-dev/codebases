import type { AttachmentWellViewState } from 'owa-attachment-well-data';
import type { RecipientContainer } from 'owa-link-data';
import type CheckPermissionStatus from '../store/schema/CheckPermissionStatus';
import getPendingPermissionBlockOnSendData from './getPendingPermissionBlockOnSendData';
import { getPendingState } from '../utils/getPendingState';

export function getPendingPermissionString(
    attachmentWell: AttachmentWellViewState,
    fromAddress: string,
    recipientContainers: RecipientContainer[]
): { title: string; issueString: string; okButton: string; cancelText: string } {
    const checkPermissionStatus: CheckPermissionStatus = getPendingState(
        attachmentWell.composeId,
        attachmentWell,
        fromAddress,
        recipientContainers
    );

    return getPendingPermissionBlockOnSendData(checkPermissionStatus);
}
