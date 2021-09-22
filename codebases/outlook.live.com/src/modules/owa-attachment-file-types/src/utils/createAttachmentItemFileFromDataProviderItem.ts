import { AttachmentFileType } from '../types/AttachmentFile';
import type AttachmentItemFile from '../types/AttachmentItemFile';
import type AttachmentDataProviderItem from 'owa-service/lib/contract/AttachmentDataProviderItem';

export default function createAttachmentItemFileFromDataProviderItem(
    providerItem: AttachmentDataProviderItem | null
): AttachmentItemFile | null {
    if (providerItem === null) {
        return null;
    }

    const attachmentItemFile: AttachmentItemFile = {
        attachmentItemId: providerItem.Id!,
        name: providerItem.Name!,
        size: providerItem.Size!,
        fileType: AttachmentFileType.AttachmentItem!,
        type: 'ItemIdAttachment:#Exchange',
    };

    return attachmentItemFile;
}
