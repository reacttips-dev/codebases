import { BOX_BASE_API_ROUTE, GET_ITEMS_DEFAULT_LIMIT } from './constants';
import type BoxItem from '../../types/BoxItem';
import type FileProviderServiceResponse from '../../types/FileProviderServiceResponse';
import callFileProviderAPI from '../../utils/callFileProviderAPI';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

interface GetBoxItemsResponse {
    total_count: number;
    entries: BoxItem[];
}

export default async function getBoxItems(
    folderId: string,
    limit: number = GET_ITEMS_DEFAULT_LIMIT
): Promise<FileProviderServiceResponse<BoxItem[]>> {
    // If folder id is not provided then we default to '0' which is the id for root folder
    folderId = folderId || '0';

    const url = `${BOX_BASE_API_ROUTE}/folders/${folderId}/items?fields=id,size,name,type,path_collection,modified_at,modified_by&limit=${limit}&offset=0`;

    const response = await callFileProviderAPI(url, AttachmentDataProviderType.Box);

    if (response.ok) {
        const responseBody = await response.text();
        const getItemsResponse = JSON.parse(responseBody) as GetBoxItemsResponse;

        return { errorResponse: null, result: getItemsResponse.entries };
    } else {
        return { errorResponse: response, result: null };
    }
}
