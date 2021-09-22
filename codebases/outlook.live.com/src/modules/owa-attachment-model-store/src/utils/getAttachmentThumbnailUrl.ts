import { GDRIVE } from 'owa-attachment-constants/lib/fileProviders';
import getGDriveItemThumbnailUrl from './getGDriveItemThumbnailUrl';
import { getAttachmentUrl } from 'owa-attachment-url';
import type { ClientAttachmentId } from 'owa-client-ids';
import AttachmentUrlType from 'owa-files-url/lib/schema/AttachmentUrlType';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

export default async function getAttachmentThumbnailUrl(
    attachmentId: ClientAttachmentId,
    attachment: AttachmentType,
    isCloudy: boolean
): Promise<string | null> {
    if (!isCloudy) {
        return getAttachmentUrl(
            attachmentId,
            attachment,
            AttachmentUrlType.Thumbnail,
            isCloudy,
            true
        );
    }

    const referenceAttachment = attachment as ReferenceAttachment;
    if (referenceAttachment.ProviderType === GDRIVE && referenceAttachment.AttachLongPathName) {
        // In case of google drive we need to make a call to an API to get the thumbnail url
        return getGDriveItemThumbnailUrl(referenceAttachment);
    }

    return referenceAttachment.AttachmentThumbnailUrl || null;
}
