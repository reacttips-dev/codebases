import AttachmentStateType from '../schema/AttachmentStateType';
import type InlineAttachmentState from '../schema/InlineAttachmentState';
import InlineAttachmentStatus from '../schema/InlineAttachmentStatus';
import type { ClientAttachmentId } from 'owa-client-ids';
import { AttachmentFileType } from 'owa-attachment-file-types';

export default function createInlineAttachmentState(
    attachmentId: ClientAttachmentId,
    placeholderId: string,
    isHidden: boolean = false,
    status: InlineAttachmentStatus = InlineAttachmentStatus.Initialized,
    skipProcessInlineImage = false
): InlineAttachmentState {
    return {
        attachmentType: AttachmentStateType.InlineAttachment,
        attachmentId: attachmentId,
        isInline: true,
        isHiddenInline: isHidden,
        placeholderId: placeholderId,
        status: status,
        fileType: AttachmentFileType.Inline,
        skipProcessInlineImage,
    };
}
