import AttachmentPreviewMethod from '../schema/AttachmentPreviewMethod';
import type AttachmentViewState from '../schema/AttachmentViewState';
import ImageLoadState from '../schema/ImageLoadState';
import type { AttachmentFileType } from 'owa-attachment-file-types';
import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';

export default function createAttachmentViewState(
    attachmentId: ClientAttachmentId,
    isReadOnly: boolean,
    isCloudy: boolean,
    isPlaceholderAttachment: boolean,
    fileType: AttachmentFileType,
    parentItemId: ClientItemId = null
): AttachmentViewState {
    const viewState: AttachmentViewState = {
        attachmentId: attachmentId,
        thumbnailLoadState: ImageLoadState.NotLoaded,
        previewLoaded: false,
        isCloudy: isCloudy,
        isReadOnly: isReadOnly,
        isPlaceholderAttachment: isPlaceholderAttachment,
        strategy: {
            allowEdit: false,
            previewMethod: AttachmentPreviewMethod.Unsupported,
            supportedOpenActions: [],
        },
        parentItemId: parentItemId,
        fileType: fileType,
    };

    return viewState;
}
