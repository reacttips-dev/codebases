import { AttachmentFileType } from '../types/AttachmentFile';
import type CloudFile from '../types/CloudFile';
import type AttachmentDataProviderItem from 'owa-service/lib/contract/AttachmentDataProviderItem';
import AttachmentDataProviderItemType from 'owa-service/lib/contract/AttachmentDataProviderItemType';

export default function createCloudFileFromDataProviderItem(
    providerItem: AttachmentDataProviderItem
): CloudFile | null {
    if (providerItem === null) {
        return null;
    }

    const cloudFile: CloudFile = {
        fileType: AttachmentFileType.Cloud,
        name: providerItem.Name!,
        size: providerItem.Size!,
        providerId: providerItem.AttachmentProviderId!,
        providerType: providerItem.ProviderType!,
        location: providerItem.Location!,
        providerEndpointUrl: providerItem.ProviderEndpointUrl!,
        isFolder: providerItem.Type === AttachmentDataProviderItemType.Folder,
        fileId: providerItem.Id!,
        fileParentId: providerItem.ParentId!,
        thumbnailUrl: providerItem.Thumbnail?.Url || '',
        previewUrl: providerItem.Preview?.Url || '',
        type: providerItem.MimeType!,
    };

    return cloudFile;
}
