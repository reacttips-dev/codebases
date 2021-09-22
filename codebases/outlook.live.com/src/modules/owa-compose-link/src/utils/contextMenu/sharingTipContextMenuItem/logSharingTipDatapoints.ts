import { LinkActionSource } from '../../../types/LinkActionSource';
import { logUsage } from 'owa-analytics';
import type { SharingTipId } from 'owa-sharing-data';

export function logIgnoreSharingTipDatapoint(sharingTipId: SharingTipId) {
    logUsage('AttachmentLinkSharingTipIgnored', [sharingTipId]);
}

export function logRefreshExpirationDatapoint(sharingTipId: SharingTipId) {
    logUsage('AttachmentLinkRefreshedSharingTip', [sharingTipId]);
}

export function logChangePermsSharingTipDatapoint(sharingTipId: SharingTipId) {
    logUsage('AttachmentLinkViewChangePermissionSharingDialog', [
        LinkActionSource.sharingTip,
        sharingTipId,
    ]);
}

export function logAttachAsCopySharingTipDatapoint(sharingTipId: SharingTipId) {
    logUsage('AttachmentLinkAttachAsACopy', {
        source: LinkActionSource.sharingTip,
        sharingTipId: sharingTipId,
    });
}
