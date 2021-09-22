import { BASE_API_ROUTE, GET_PHOTOS_DEFAULT_LIMIT } from './constants';
import type { FacebookPhotoItem } from '../../types/FacebookItem';
import type FacebookPagination from '../../types/FacebookPagination';
import type FacebookPhotoType from '../../types/FacebookPhototype';
import type FileProviderServiceResponse from '../../types/FileProviderServiceResponse';
import callFileProviderAPI from '../../utils/callFileProviderAPI';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

interface GetFacebookPhotosResponse {
    data: FacebookPhotoItem[];
    paging: FacebookPagination;
}

export default async function getFacebookPhotos(
    photoType: FacebookPhotoType,
    limit: number = GET_PHOTOS_DEFAULT_LIMIT
): Promise<FileProviderServiceResponse<FacebookPhotoItem[]>> {
    const url = `${BASE_API_ROUTE}/me/photos/?fields=id,name,images,from,link,album,place,created_time&type=${photoType.toString()}&limit=${limit}`;

    const response = await callFileProviderAPI(url, AttachmentDataProviderType.Facebook);

    if (response.ok) {
        const responseBody = await response.text();
        const getPhotosResponse = JSON.parse(responseBody) as GetFacebookPhotosResponse;

        return { errorResponse: null, result: getPhotosResponse.data };
    } else {
        return { errorResponse: response, result: null };
    }
}
