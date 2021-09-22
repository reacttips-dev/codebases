import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type DeleteFolderJsonRequest from '../contract/DeleteFolderJsonRequest';
import type DeleteFolderJsonResponse from '../contract/DeleteFolderJsonResponse';
import deleteFolderJsonRequest from '../factory/deleteFolderJsonRequest';

export default function deleteFolderOperation(
    req: DeleteFolderJsonRequest,
    options?: RequestOptions
): Promise<DeleteFolderJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = deleteFolderJsonRequest(req);
    }

    return makeServiceRequest<DeleteFolderJsonResponse>('DeleteFolder', req, options);
}
