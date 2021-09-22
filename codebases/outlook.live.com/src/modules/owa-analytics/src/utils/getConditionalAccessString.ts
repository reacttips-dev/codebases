import getAttachmentPolicy from 'owa-session-store/lib/utils/getAttachmentPolicy';

export default function getConditionalAccessString(): string {
    const attachmentPolicy = getAttachmentPolicy() || {};

    if (
        attachmentPolicy.ConditionalAccessDirectFileAccessOnPrivateComputersBlocked ||
        attachmentPolicy.ConditionalAccessDirectFileAccessOnPublicComputersBlocked
    ) {
        if (
            attachmentPolicy.ConditionalAccessWacViewingOnPrivateComputersBlocked ||
            attachmentPolicy.ConditionalAccessWacViewingOnPublicComputersBlocked
        ) {
            return 'ReadOnlyPlusAttachmentsBlocked';
        } else {
            return 'ReadOnly';
        }
    }
    return 'None';
}
