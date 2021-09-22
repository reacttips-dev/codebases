import { action } from 'satcheljs';
import type { ClientAttachmentId } from 'owa-client-ids';

export const refreshSharingTipsForAttachment = action(
    'REFRESH_SHARING_TIPS_FOR_ATTACHMENT',
    (attachmentId: ClientAttachmentId) => ({
        attachmentId: attachmentId,
    })
);

export const setAttachmentContentId = action(
    'SET_ATTACHMENT_CONTENTID',
    (attachmentId: ClientAttachmentId, attachmentContentId: string) => ({
        attachmentId: attachmentId,
        attachmentContentId: attachmentContentId,
    })
);

export const setAttachmentIsInline = action(
    'SET_ATTACHMENT_ISINLINE',
    (attachmentId: ClientAttachmentId, isInline: boolean) => ({
        attachmentId: attachmentId,
        isInline: isInline,
    })
);
