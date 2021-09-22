import ActionMessageId from '../schema/ActionMessageId';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';

export default function shouldAlwaysShowImageOverlay(
    attachmentViewState: AttachmentFullViewState
): boolean {
    return attachmentViewState.actionMessage !== ActionMessageId.None;
}
