import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type FileProviderServiceResponse from '../../types/FileProviderServiceResponse';
import type OneDriveItem from '../../types/OneDriveItem';
import { getAllColumnNames } from './columns';
import { ROOT_FOLDER_ID } from './constants';
import { getAPIBaseForId } from './getAPIBase';
import { POST_METHOD_NAME, CORS_MODE_NAME, fetchService } from 'owa-data-provider-info-fetcher';

export async function createOneDriveFolder(
    providerType: AttachmentDataProviderType.OneDriveConsumer,
    apiBaseUrl: 'https://api.onedrive.com',
    folderName: string,
    parentFolderId?: string
): Promise<FileProviderServiceResponse<OneDriveItem>>;
export async function createOneDriveFolder(
    providerType: AttachmentDataProviderType.OneDrivePro,
    apiBaseUrl: string,
    folderName: string,
    parentFolderId?: string
): Promise<FileProviderServiceResponse<OneDriveItem>>;
export async function createOneDriveFolder(
    providerType:
        | AttachmentDataProviderType.OneDriveConsumer
        | AttachmentDataProviderType.OneDrivePro,
    apiBaseUrl: string,
    folderName: string,
    parentFolderId?: string
): Promise<FileProviderServiceResponse<OneDriveItem>> {
    parentFolderId = parentFolderId || ROOT_FOLDER_ID;

    const query = `expand=thumbnails(select=medium)&select=${getAllColumnNames()}`;
    const url = `${apiBaseUrl}/${getAPIBaseForId(
        providerType
    )}/${parentFolderId}/children?${query}`;
    const requestBody = {
        name: folderName,
        folder: {},
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    try {
        const fullResponseText = await fetchService(
            providerType,
            encodeURI(url),
            url,
            {
                method: POST_METHOD_NAME,
                mode: CORS_MODE_NAME,
                body: JSON.stringify(requestBody),
                datapointNamePrefix: 'createNewFolder',
            },
            null
        );

        const createFolderResponse = JSON.parse(fullResponseText) as OneDriveItem;

        return { errorResponse: null, result: createFolderResponse };
    } catch (error) {
        return { errorResponse: error, result: null };
    }
}
