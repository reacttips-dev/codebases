import { getTypeOfAttachment, TypeOfAttachment } from 'owa-attachment-type';
import type {
    default as AttachmentModel,
    ReferenceAttachmentModel,
} from '../store/schema/AttachmentModel';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

export default function isCloudyAttachment(
    attachment: AttachmentModel
): attachment is ReferenceAttachmentModel {
    return isCloudyTypeAttachment(attachment.type);
}

export function isCloudyAttachmentType(
    attachment: AttachmentType
): attachment is ReferenceAttachment {
    const typeOfAttachment = getTypeOfAttachment(attachment);
    return isCloudyTypeAttachment(typeOfAttachment);
}

function isCloudyTypeAttachment(attachmentType: TypeOfAttachment): boolean {
    return (
        attachmentType === TypeOfAttachment.Reference || attachmentType === TypeOfAttachment.Link
    );
}
