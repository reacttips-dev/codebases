import { isSmimeAttachmentType } from 'owa-attachment-model-store';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import { downloadFileFromUrl } from 'download-file-from-url';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { lazyDownloadSmimeAttachment } from 'owa-smime';
import { lazyIsHxAttachment, lazyDownloadAttachmentFromHx } from 'owa-attachment-download-hx';
import { isFeatureEnabled } from 'owa-feature-flags';
import type AttachmentId from 'owa-service/lib/contract/AttachmentId';

/**
 * Utility which handles the download of an attachment
 * For S/MIME attachments we pass on the control to owa-smime
 * @param attachmentId
 * @param isCloudy
 * @param container
 */
export default async function downloadAttachment(
    attachmentId: AttachmentId,
    isCloudy: boolean,
    container?: HTMLElement
) {
    const attachmentModel = getAttachment(attachmentId);
    if (!attachmentModel) {
        return;
    }

    if (
        isHostAppFeatureEnabled('nativeHostAttachmentHijack') &&
        isFeatureEnabled('mon-rp-downloadAttachmentsOverHx')
    ) {
        // check if it is a hx attachment behind a lazy boundary to avoid
        // loading all of @outlook/hxcore in web.
        if ((await lazyIsHxAttachment.import())(attachmentId)) {
            (await lazyDownloadAttachmentFromHx.import())(attachmentId.Id);
            return;
        }
        // otherwise, if it was not a hx attachment, fall through to downloading
        // the attachment through normal web methods.
    }

    if (isSmimeAttachmentType(attachmentModel.model)) {
        (await lazyDownloadSmimeAttachment.import())(attachmentModel.model);
    } else {
        const downloadUrl = attachmentModel.download.url;
        downloadUrl && downloadFileFromUrl(downloadUrl, isCloudy, container);
    }
}
