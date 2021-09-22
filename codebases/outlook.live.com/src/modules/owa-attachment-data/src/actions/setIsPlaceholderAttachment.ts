import type AttachmentViewState from '../schema/AttachmentViewState';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setIsPlaceholderAttachment',
    function setIsPlacholderAttachment(attachment: AttachmentViewState, isPlaceholder: boolean) {
        attachment.isPlaceholderAttachment = isPlaceholder;
    }
);
