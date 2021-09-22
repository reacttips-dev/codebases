import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('setShouldShowImageOverlay')(function setShouldShowImageOverlay(
    attachment: AttachmentFullViewState,
    newValue: boolean
) {
    attachment.shouldShowImageOverlay = newValue;
});
