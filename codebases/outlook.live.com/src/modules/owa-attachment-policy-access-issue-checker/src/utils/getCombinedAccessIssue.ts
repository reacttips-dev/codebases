import AccessIssue from '../schema/AccessIssue';
import getAttachmentPolicyBasedOnFlag from './getAttachmentPolicyBasedOnFlag';

/**
 * Those fields combine both conditional access and attachment policy
 * the logic is on the server code
 */

export default function getCombinedAccessIssue(): AccessIssue {
    const attachmentPolicy = getAttachmentPolicyBasedOnFlag();

    if (
        !attachmentPolicy.DirectFileAccessOnPrivateComputersEnabled ||
        !attachmentPolicy.DirectFileAccessOnPublicComputersEnabled
    ) {
        if (
            !attachmentPolicy.WacViewingOnPrivateComputersEnabled ||
            !attachmentPolicy.WacViewingOnPublicComputersEnabled
        ) {
            return AccessIssue.ReadOnlyPlusAttachmentsBlocked;
        } else {
            return AccessIssue.ReadOnly;
        }
    }
    return AccessIssue.None;
}
