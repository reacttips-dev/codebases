import isPdf from './isPdf';
import isPDFPreviewSupported from './isPDFPreviewSupported';
import {
    getAttachmentPolicyInfo,
    getAttachmentPolicyInfoForPublicComputer,
} from 'owa-attachment-policy';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

export default function shouldPreviewNativeViewableDocument(
    attachment: AttachmentType,
    isCloudy: boolean
): boolean {
    if (isPdf(attachment) && isPDFPreviewSupported()) {
        if (isCloudy) {
            return true;
        } else {
            const publicPolicyInfo = getAttachmentPolicyInfoForPublicComputer(
                attachment,
                true /* isWacPreviewSupportedOnPlatform */
            );
            const policyInfo = getAttachmentPolicyInfo(
                attachment,
                true /* isWacPreviewSupportedOnPlatform */
            );
            return policyInfo.directFileAccessEnabled && publicPolicyInfo.directFileAccessEnabled;
        }
    }

    return false;
}
