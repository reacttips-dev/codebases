import { userDate } from 'owa-datetime';
import { isFeatureEnabled } from 'owa-feature-flags';
import AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import type GetSharingInfoResponse from 'owa-service/lib/contract/GetSharingInfoResponse';
import type { ODBSharingInfo } from 'owa-sharing-data';

export default function createSharingInfoFromGetSharingInfoResponse(
    response: GetSharingInfoResponse
): ODBSharingInfo | null {
    if (!response || response.ResultCode !== AttachmentResultCode.Success) {
        return null;
    }

    // Expiration work is not being done for reference attachments as of now (3/8/2019)
    // This flight is to disable expiration features for attachments, until we decide that
    // such work is worth doing
    if (!isFeatureEnabled('doc-attachment-referenceAttachmentExpiration')) {
        response.ExpirationDate = null;
    }

    return {
        getSharingInfoSucceeded: true,
        blocksDownload: response.BlocksDownload,
        canonicalUrl: response.CanonicalUrl,
        canShareInternally: response.CanShareInternally,
        canShareExternally: response.CanShareExternally,
        expirationDate: response.ExpirationDate ? userDate(response.ExpirationDate) : null,
        canRefresh: false, // Expiration work is not being done for reference attachments as of now (3/8/2019)
        shareId: response.ShareId,
        siteUrl: response.SiteUrl,
        linkType: response.Type,
        itemUniqueId: response.ItemUniqueId,
        mimeType: response.MimeType,
    };
}
