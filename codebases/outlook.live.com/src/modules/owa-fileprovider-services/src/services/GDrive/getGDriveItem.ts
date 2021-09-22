import { GDRIVE_BASE_API_ROUTER } from './constants';
import type FileProviderServiceResponse from '../../types/FileProviderServiceResponse';
import type GDriveItem from '../../types/GDriveItem';
import callFileProviderAPI from '../../utils/callFileProviderAPI';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

export default async function getGDriveItem(
    itemId: string
): Promise<FileProviderServiceResponse<GDriveItem>> {
    const url = `${GDRIVE_BASE_API_ROUTER}/${itemId}?fields=id,mimeType,name,size,modifiedTime,createdTime,thumbnailLink,webViewLink,webContentLink,fileExtension`;
    const response = await callFileProviderAPI(url, AttachmentDataProviderType.GDrive);

    if (response.ok) {
        const responseBody = await response.text();
        const getItemResponse = JSON.parse(responseBody) as GDriveItem;

        return { errorResponse: null, result: getItemResponse };
    } else {
        return { errorResponse: response, result: null };
    }
}
