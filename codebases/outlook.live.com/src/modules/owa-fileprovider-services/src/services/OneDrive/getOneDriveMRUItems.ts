import { CORS_MODE_NAME, fetchService, GET_METHOD_NAME } from 'owa-data-provider-info-fetcher';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type FileProviderServiceResponse from '../../types/FileProviderServiceResponse';
import type { default as OneDriveFile } from '../../types/OneDriveFile';
import type { default as OneDrivePackage } from '../../types/OneDrivePackage';

export interface OneDriveMRUItemsResponse {
    '@odata.context': string;
    value: OneDriveMRUItem[];
}

export interface OneDriveMRUItem {
    id: string;
    name: string;
    remoteItem: RemoteItem;
    package: OneDrivePackage;
}

interface RemoteItem {
    id: string;
    size: number;
    file: OneDriveFile;
    fileSystemInfo: FileSystemInfo;
    lastModifiedBy: LastModifiedBy;
    webDavUrl: string;
}

interface FileSystemInfo {
    lastAccessedDateTime: string;
}

interface LastModifiedBy {
    user: User;
}

interface User {
    displayName: string;
}

export async function getOneDriveMRUItems(
    endpointUrl: string,
    providerType: AttachmentDataProviderType,
    isPrefetch: boolean = false
): Promise<FileProviderServiceResponse<OneDriveMRUItemsResponse>> {
    let url: string;
    switch (providerType) {
        case AttachmentDataProviderType.OneDriveConsumer:
            url = 'https://api.onedrive.com/v2.1/drive/recent?top=50';
            break;
        case AttachmentDataProviderType.OneDrivePro:
            url = endpointUrl + '/_api/v2.1/drive/recent?top=50';
            break;
        default:
            throw Error('OneDriveMRUItems only supports OneDrive providers!');
    }

    let getItemsResponse: OneDriveMRUItemsResponse;
    try {
        const response: string = await fetchService(
            providerType,
            url,
            url,
            {
                method: GET_METHOD_NAME,
                mode: CORS_MODE_NAME,
                datapointNamePrefix: 'getOneDriveMRUItems',
            },
            null,
            isPrefetch
        );
        getItemsResponse = JSON.parse(response) as OneDriveMRUItemsResponse;
    } catch {}

    if (getItemsResponse) {
        return { errorResponse: null, result: getItemsResponse };
    } else {
        return { errorResponse: null, result: null };
    }
}
