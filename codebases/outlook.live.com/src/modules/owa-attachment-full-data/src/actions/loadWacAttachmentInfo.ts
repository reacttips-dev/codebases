import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import disableWacPreview from 'owa-attachment-data/lib/actions/disableWacPreview';
import AttachmentPreviewMethod from 'owa-attachment-data/lib/schema/AttachmentPreviewMethod';
import initializeWacUrl from 'owa-attachment-wac/lib/actions/initialization/initializeWacUrl';
import WacAttachmentStatus from 'owa-service/lib/contract/WacAttachmentStatus';

export default async function loadWacAttachmentInfo(attachmentViewState: AttachmentFullViewState) {
    if (attachmentViewState.strategy.previewMethod === AttachmentPreviewMethod.Wac) {
        const wacAttachmentTypeResponse = await initializeWacUrl(
            attachmentViewState.attachmentId,
            false
        );

        if (
            wacAttachmentTypeResponse.Status ===
                WacAttachmentStatus.AttachmentDataProviderNotSupported ||
            wacAttachmentTypeResponse.Status === WacAttachmentStatus.AttachmentDataProviderError
        ) {
            // this is to make the click action not invoke preview as data provider does not support WAC viewing
            disableWacPreview(attachmentViewState.strategy);
        }
    }
}
