import { DROPBOX_FILE_BASE_API_ROUTE } from './constants';
import type DropboxItem from '../../types/DropboxItem';
import type FileProviderServiceResponse from '../../types/FileProviderServiceResponse';
import callFileProviderAPI from '../../utils/callFileProviderAPI';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

interface GetDropboxItemResponse {
    entries: DropboxItem[];
}

export interface GetDropboxItemsParams {
    path: string;
    recursive?: boolean;
    include_media_info?: boolean;
    include_deleted?: boolean;
    include_has_explicit_shared_members?: boolean;
    include_mounted_folders?: boolean;
    limit?: number;
}

export default async function getDropboxItems(
    params: GetDropboxItemsParams
): Promise<FileProviderServiceResponse<DropboxItem[]>> {
    // If the path is not provided we default the path to empty string for root
    params.path = params.path || '';

    const url = `${DROPBOX_FILE_BASE_API_ROUTE}/list_folder`;

    const request: RequestInit = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
        body: JSON.stringify(params),
    };

    const response = await callFileProviderAPI(url, AttachmentDataProviderType.Dropbox, {
        requestInit: request,
    });

    if (response.ok) {
        const responseBody = await response.text();
        const getItemsResponse = JSON.parse(responseBody) as GetDropboxItemResponse;

        return { errorResponse: null, result: getItemsResponse.entries };
    } else {
        return { errorResponse: response, result: null };
    }
}
