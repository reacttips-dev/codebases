import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import AttachmentPolicyChecker, {
    AttachmentPolicyInfo,
    AttachmentPolicyLevel,
    getAttachmentPolicyInfo,
    getUserAttachmentPolicyChecker,
} from './attachmentPolicyChecker';

export default function getIsSaveToCloudSupported(
    attachment: AttachmentType,
    isCloudyAttachmentOrLink: boolean,
    isReadOnly: boolean,
    isSMIMEItem: boolean,
    isProtectedVoiceMail: boolean
): boolean {
    if (isSMIMEItem || isProtectedVoiceMail) {
        return false;
    }

    const attachmentPolicyInfo: AttachmentPolicyInfo = getAttachmentPolicyInfo(attachment, true);
    const attachmentPolicyChecker: AttachmentPolicyChecker = getUserAttachmentPolicyChecker();

    return (
        attachmentPolicyInfo.level !== AttachmentPolicyLevel.Block &&
        attachmentPolicyChecker.saveAttachmentsToCloudEnabled &&
        !isCloudyAttachmentOrLink &&
        isReadOnly
    );
}
