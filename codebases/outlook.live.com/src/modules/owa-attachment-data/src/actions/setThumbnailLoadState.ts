import type AttachmentViewState from '../schema/AttachmentViewState';
import type ImageLoadState from '../schema/ImageLoadState';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setThumbnailLoadState',
    function setThumbnailLoadState(attachment: AttachmentViewState, newState: ImageLoadState) {
        attachment.thumbnailLoadState = newState;
    }
);
