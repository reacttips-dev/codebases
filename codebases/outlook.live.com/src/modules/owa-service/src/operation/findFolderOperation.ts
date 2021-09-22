import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type FindFolderJsonRequest from '../contract/FindFolderJsonRequest';
import type FindFolderJsonResponse from '../contract/FindFolderJsonResponse';
import findFolderJsonRequest from '../factory/findFolderJsonRequest';

export default function findFolderOperation(
    req: FindFolderJsonRequest,
    options?: RequestOptions
): Promise<FindFolderJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = findFolderJsonRequest(req);
    }

    return makeServiceRequest<FindFolderJsonResponse>('FindFolder', req, options);
}
