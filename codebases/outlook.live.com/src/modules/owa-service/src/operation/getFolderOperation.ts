import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetFolderJsonRequest from '../contract/GetFolderJsonRequest';
import type GetFolderJsonResponse from '../contract/GetFolderJsonResponse';
import getFolderJsonRequest from '../factory/getFolderJsonRequest';

export default function getFolderOperation(
    req: GetFolderJsonRequest,
    options?: RequestOptions
): Promise<GetFolderJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getFolderJsonRequest(req);
    }

    return makeServiceRequest<GetFolderJsonResponse>('GetFolder', req, options);
}
