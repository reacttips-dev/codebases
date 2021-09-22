import getDataProviderInfo from './DataProviderInfo/getDataProviderInfo';
import { isSmimeAttachment } from './isSmimeAttachmentType';
import { getAttachmentPolicyInfo } from 'owa-attachment-policy';
import { isImageFile, isThumbnailableDocument } from 'owa-file';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import { isAttachmentOfReferenceType } from 'owa-attachment-type/lib/isAttachmentOfReferenceType';
import { isAttachmentOfFileType } from 'owa-attachment-type/lib/isAttachmentOfFileType';
import { isAttachmentOfItemIdType } from 'owa-attachment-type/lib/isAttachmentOfItemIdType';

export default function shouldShowImageView(attachment: AttachmentType): boolean {
    const policyInfo = getAttachmentPolicyInfo(attachment, true);
    if (
        (!policyInfo.directFileAccessEnabled && !attachment.IsInline) ||
        isSmimeAttachment(attachment.AttachmentId.Id)
    ) {
        return false;
    }

    if (attachment.Thumbnail) {
        return true;
    }

    const isImageAttachment = isImageFile(
        attachment.Name,
        attachment.ContentType,
        false /* considerTiffAsImage */
    );
    const isThumbnailableDocumentAttachment = isThumbnailableDocument(attachment.Name);

    if (
        (isAttachmentOfFileType(attachment) || isAttachmentOfItemIdType(attachment)) &&
        (isImageAttachment || isThumbnailableDocumentAttachment)
    ) {
        return true;
    }

    if (isAttachmentOfReferenceType(attachment)) {
        // type is narrowed to ReferenceAttachment by the isAttachmentOfReferenceType type discriminator
        const dataProviderInfo = getDataProviderInfo(attachment.ProviderType);

        if (
            attachment.AttachmentThumbnailUrl ||
            (isImageAttachment && dataProviderInfo && dataProviderInfo.supportImageThumbnail)
        ) {
            return true;
        }
    }

    return false;
}
