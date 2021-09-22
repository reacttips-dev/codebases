import CheckPermissionStatus from '../store/schema/CheckPermissionStatus';
import { isCheckPermPending } from 'owa-recipient-permission-checker';
import { getLinkSharingIssues } from '../utils/getHasSharingIssues';
import type { AttachmentWellViewState } from 'owa-attachment-well-data';
import type { RecipientContainer } from 'owa-link-data';

export function getPendingState(
    composeId: string,
    attachmentWell: AttachmentWellViewState,
    fromAddress: string,
    recipientContainers: RecipientContainer[]
): CheckPermissionStatus {
    const isPermPending: boolean = isCheckPermPending(composeId);

    if (isPermPending) {
        return CheckPermissionStatus.InProcess;
    } else {
        const sharingIssues = getLinkSharingIssues(
            attachmentWell,
            fromAddress,
            recipientContainers
        );
        if (sharingIssues.length !== 0) {
            return CheckPermissionStatus.NoAccess;
        }
    }

    return CheckPermissionStatus.HasAccess;
}
