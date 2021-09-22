import { DROPBOX } from 'owa-attachment-constants/lib/fileProviders';
import { isCloudyAttachmentType } from './isCloudyAttachment';
import { getAttachmentUrl } from 'owa-attachment-url';
import type { ClientAttachmentId } from 'owa-client-ids';
import AttachmentUrlType from 'owa-files-url/lib/schema/AttachmentUrlType';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

function getDownloadUrlForDropbox(attachment: ReferenceAttachment): string {
    const location = attachment.AttachLongPathName;
    const lastIndex = location.lastIndexOf('?');
    const urlWithoutParams = location.substring(0, lastIndex);

    return `${urlWithoutParams}?dl=1`;
}

export default function getFullFileDownloadUrl(
    attachmentId: ClientAttachmentId,
    attachment: AttachmentType,
    isReadyOnly: boolean,
    addIsDownloadQueryParam: boolean = false
): string {
    if (isCloudyAttachmentType(attachment)) {
        // For any other provider create a function
        // to get the download url and call it here
        // corresponding to the provider type
        switch (attachment.ProviderType) {
            case DROPBOX:
                return getDownloadUrlForDropbox(attachment);
        }
    }

    return getAttachmentUrl(
        attachmentId,
        attachment,
        AttachmentUrlType.FullFile,
        isCloudyAttachmentType(attachment),
        isReadyOnly,
        addIsDownloadQueryParam
    );
}
