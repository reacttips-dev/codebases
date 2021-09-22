import type * as Schema from 'owa-graph-schema';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ItemAttachment from 'owa-service/lib/contract/ItemAttachment';
import type ItemIdAttachment from 'owa-service/lib/contract/ItemIdAttachment';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import {
    FILE_ATTACHMENT_TYPE,
    ITEM_ATTACHMENT_TYPE,
    ITEM_ID_ATTACHMENT_TYPE,
    REFERENCE_ATTACHMENT_TYPE,
    LINK_ATTACHMENT_TYPE,
} from 'owa-attachment-constants/lib/attachmentTypes';
import { isStringNullOrWhiteSpace } from 'owa-localize';
import { isItemClassOfMessageType } from './isItemClassOfMessageType';
import { TypeOfAttachment } from './TypeOfAttachment';

export function getTypeOfAttachment(attachment: AttachmentType): TypeOfAttachment {
    const attachmentType = attachment.__type || (attachment as Schema.Attachment).OwsTypeName;
    switch (attachmentType) {
        case FILE_ATTACHMENT_TYPE:
            return TypeOfAttachment.File;
        case REFERENCE_ATTACHMENT_TYPE:
            // Reference attachments can be links. This was reused so we can leverage all the code
            // that we currently have that pretty much knows how to handle all the properties
            // which are conceptually pretty much the same between reference and link (in the body) attachments
            const referenceAttachment: ReferenceAttachment = attachment;
            if (referenceAttachment.IsLink) {
                return TypeOfAttachment.Link;
            }
            return TypeOfAttachment.Reference;
        case LINK_ATTACHMENT_TYPE:
            return TypeOfAttachment.Link;
        case ITEM_ATTACHMENT_TYPE:
            return TypeOfAttachment.Mail;
        case ITEM_ID_ATTACHMENT_TYPE:
            /**
             * This will solve a problem where we have a file being attached
             * but the assumption that the ItemId is always a Mail is misleading
             * since it can be a CalendarItem or any other Item on the Mailbox.
             * Alternatively, EmbeddedItemClass can be used to ascertain if it is a Mail Item
             * */
            const itemIdAttachment = attachment as ItemIdAttachment;
            const embeddedItemClass = (<ItemAttachment>attachment).EmbeddedItemClass;
            const isMailItem = embeddedItemClass && isItemClassOfMessageType(embeddedItemClass);
            if (!isMailItem && !isStringNullOrWhiteSpace(itemIdAttachment.AttachmentIdToAttach)) {
                return TypeOfAttachment.File;
            }

            return TypeOfAttachment.Mail;
        default:
            throw new Error(`Invalid type of attachment ${attachmentType}`);
    }
}
