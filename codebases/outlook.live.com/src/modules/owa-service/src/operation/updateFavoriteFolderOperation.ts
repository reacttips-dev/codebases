import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type UpdateFavoriteFolderRequest from '../contract/UpdateFavoriteFolderRequest';
import type UpdateFavoriteFolderResponse from '../contract/UpdateFavoriteFolderResponse';
import updateFavoriteFolderRequest from '../factory/updateFavoriteFolderRequest';

export default function updateFavoriteFolderOperation(
    req: { request: UpdateFavoriteFolderRequest },
    options?: RequestOptions
): Promise<UpdateFavoriteFolderResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = updateFavoriteFolderRequest(req.request);
    }

    return makeServiceRequest<UpdateFavoriteFolderResponse>('UpdateFavoriteFolder', req, options);
}
