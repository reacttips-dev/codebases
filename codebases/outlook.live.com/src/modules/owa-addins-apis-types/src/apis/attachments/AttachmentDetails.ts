import type * as Schema from 'owa-graph-schema';
import { isStringNullOrWhiteSpace } from 'owa-localize';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ItemIdAttachment from 'owa-service/lib/contract/ItemIdAttachment';
import {
    FILE_ATTACHMENT_TYPE,
    ITEM_ATTACHMENT_TYPE,
    ITEM_ID_ATTACHMENT_TYPE,
    REFERENCE_ATTACHMENT_TYPE,
} from 'owa-attachment-constants/lib/attachmentTypes';
import { isAttachmentOfReferenceType } from 'owa-attachment-type/lib/isAttachmentOfReferenceType';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

export interface AttachmentDetails {
    id: string;
    name: string;
    contentType?: string;
    size?: number;
    attachmentType: AddinsSupportedAttachmentType;
    isInline: boolean;
    url?: string;
}

// Order matters
export enum AddinsSupportedAttachmentType {
    File = 0,
    Item = 1,
    Cloud = 2,
}

export const createAttachmentDetails = (attachments: AttachmentType[]): AttachmentDetails[] => {
    return attachments.map(
        attachment =>
            <AttachmentDetails>{
                id: getIdOrUrl(attachment),
                name: attachment.Name,
                contentType: attachment.ContentType,
                size: attachment.Size,
                attachmentType: getTypeOfAttachment(attachment),
                isInline: attachment.IsInline || false,
            }
    );
};

function getIdOrUrl(attachment: AttachmentType): string | undefined {
    return isAttachmentOfReferenceType(attachment)
        ? (attachment as ReferenceAttachment).AttachLongPathName
        : attachment.AttachmentId?.Id;
}

export function getTypeOfAttachment(attachment: AttachmentType): AddinsSupportedAttachmentType {
    // Why is this duplicated from packages/addins/packages/addins/owa-addins-common-utils/lib/getAllAttachments.ts,
    // but with added support for itemid attachments. Is one of them correct and the other
    // missing a case? or should itemId attachments be omitted?

    /* reference for this fix- packages\common\controls\packages\attachments\data\owa-attachment-type\lib\getTypeOfAttachment.ts*/
    const attachmentType = attachment.__type || (attachment as Schema.Attachment).OwsTypeName;
    switch (attachmentType) {
        case FILE_ATTACHMENT_TYPE:
            return AddinsSupportedAttachmentType.File;
        case ITEM_ATTACHMENT_TYPE:
            return AddinsSupportedAttachmentType.Item;
        case REFERENCE_ATTACHMENT_TYPE:
            return AddinsSupportedAttachmentType.Cloud;
        case ITEM_ID_ATTACHMENT_TYPE:
            const itemIdAttachment = attachment as ItemIdAttachment;
            if (!isStringNullOrWhiteSpace(itemIdAttachment.AttachmentIdToAttach)) {
                return AddinsSupportedAttachmentType.File;
            }
            return AddinsSupportedAttachmentType.Item;
        default:
            throw new Error(`Invalid type of attachment ${attachment.__type}`);
    }
}
