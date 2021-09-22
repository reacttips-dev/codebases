import AccessIssue from '../schema/AccessIssue';
import getAttachmentPolicy from 'owa-session-store/lib/utils/getAttachmentPolicy';

/**
 * This function is used only for conditional access mail tip.
 * For functionality we use getCombinedAccessIssue, as it capture both attachmnets policy and conditional access
 * Supported conditional access for attachments:
 * 1) None: No conditional access policy is applied
 * 2) ReadOnly: Users can't download attachments to their local computer, and can't enable Offline Mode on non-compliant computers. They can still view attachments in the browser.
 * 3) ReadOnlyPlusAttachmentsBlocked: All restrictions from ReadOnly apply, but users can't view attachments in the browser.
 */

export default function getConditionalAccessIssue(): AccessIssue[] {
    const attachmentPolicy = getAttachmentPolicy();

    if (
        attachmentPolicy.ConditionalAccessDirectFileAccessOnPrivateComputersBlocked ||
        attachmentPolicy.ConditionalAccessDirectFileAccessOnPublicComputersBlocked
    ) {
        if (
            attachmentPolicy.ConditionalAccessWacViewingOnPrivateComputersBlocked ||
            attachmentPolicy.ConditionalAccessWacViewingOnPublicComputersBlocked
        ) {
            return [AccessIssue.ReadOnlyPlusAttachmentsBlocked];
        } else {
            return [AccessIssue.ReadOnly];
        }
    }
    return [];
}
