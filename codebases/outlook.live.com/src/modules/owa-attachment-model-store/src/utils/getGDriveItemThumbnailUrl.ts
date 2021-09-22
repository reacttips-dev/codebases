import { getGDriveItem } from 'owa-fileprovider-services';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import getGDriveItemIdFromShareUrl from './getGDriveItemIdFromShareUrl';

export default async function getGDriveItemThumbnailUrl(
    referenceAttachment: ReferenceAttachment
): Promise<string> {
    // This throws if getGDriveItemIdFromShareUrl() throws
    const itemId = getGDriveItemIdFromShareUrl(referenceAttachment.AttachLongPathName);
    const response = await getGDriveItem(itemId);
    return response.result?.thumbnailLink || null;
}
