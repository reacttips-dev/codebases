import { isFeatureEnabled } from 'owa-feature-flags';
import getAttachmentPolicy from 'owa-session-store/lib/utils/getAttachmentPolicy';

export default function getAttachmentPolicyBasedOnFlag() {
    const attachmentPolicy = getAttachmentPolicy();

    // 'fwk-devTools' is a feature flag that enabled only on deployed-link / 'gulp'
    if (isFeatureEnabled('fwk-devTools')) {
        if (isFeatureEnabled('doc-attachment-CA-readOnlyAccessIssues')) {
            return {
                ...attachmentPolicy,
                DirectFileAccessOnPrivateComputersEnabled: false,
                DirectFileAccessOnPublicComputersEnabled: false,
                WacViewingOnPrivateComputersEnabled: true,
                WacViewingOnPublicComputersEnabled: true,
            };
        }
        if (isFeatureEnabled('doc-attachment-CA-readOnlyPlusAttachmentsBlocked')) {
            return {
                ...attachmentPolicy,
                DirectFileAccessOnPrivateComputersEnabled: false,
                DirectFileAccessOnPublicComputersEnabled: false,
                WacViewingOnPrivateComputersEnabled: false,
                WacViewingOnPublicComputersEnabled: false,
            };
        }
    }
    return attachmentPolicy;
}
