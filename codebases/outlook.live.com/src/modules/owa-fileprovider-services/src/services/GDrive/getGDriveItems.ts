import { GDRIVE_BASE_API_ROUTER } from './constants';
import type FileProviderServiceResponse from '../../types/FileProviderServiceResponse';
import type GDriveItem from '../../types/GDriveItem';
import callFileProviderAPI from '../../utils/callFileProviderAPI';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

export interface GDriveItemsResponse {
    nextPageToken: string;
    files: GDriveItem[];
}

export default async function getGDriveItems(
    query: string,
    forceTokenRefresh: boolean = false
): Promise<FileProviderServiceResponse<GDriveItemsResponse>> {
    const url = `${GDRIVE_BASE_API_ROUTER}?${query}`;
    const response = await callFileProviderAPI(url, AttachmentDataProviderType.GDrive, {
        forceTokenRefresh: forceTokenRefresh,
    });

    if (response.ok) {
        const responseBody = await response.text();
        const getItemsResponse = JSON.parse(responseBody) as GDriveItemsResponse;

        return { errorResponse: null, result: getItemsResponse };
    } else {
        return { errorResponse: response, result: null };
    }
}
