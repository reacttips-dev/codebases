import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('setAttachmentShouldShowContextMenu')(
    function setAttachmentShouldShowContextMenu(
        attachment: AttachmentFullViewState,
        newValue: boolean
    ) {
        attachment.shouldShowContextMenu = newValue;
    }
);
