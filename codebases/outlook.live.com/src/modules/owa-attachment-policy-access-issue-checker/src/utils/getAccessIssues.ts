import type AccessIssue from '../schema/AccessIssue';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import getConditionalAccessIssue from './getConditionalAccessIssue';
import { getInfoBarId } from './getInfoBarId';
import { isAttachmentOfReferenceType as isCloudyAttachment } from 'owa-attachment-type/lib/isAttachmentOfReferenceType';

export function getAccessIssues(): AccessIssue[] {
    return getConditionalAccessIssue();
}

export function getAccessIssuesForAttachments(attachments: AttachmentType[]): string[] {
    const accessIssues: AccessIssue[] =
        attachments && attachments.length > 0 && hasNonInlineAttachment(attachments)
            ? getConditionalAccessIssue()
            : [];
    return accessIssues.map(getInfoBarId);
}

function hasNonInlineAttachment(attachments: AttachmentType[]) {
    return attachments.some(a => !isInline(a));
}

function isInline(attachment: AttachmentType): boolean {
    return attachment.IsInline && !isCloudyAttachment(attachment);
}
