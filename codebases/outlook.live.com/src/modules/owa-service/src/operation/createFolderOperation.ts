import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type CreateFolderJsonRequest from '../contract/CreateFolderJsonRequest';
import type CreateFolderJsonResponse from '../contract/CreateFolderJsonResponse';
import createFolderJsonRequest from '../factory/createFolderJsonRequest';

export default function createFolderOperation(
    req: CreateFolderJsonRequest,
    options?: RequestOptions
): Promise<CreateFolderJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = createFolderJsonRequest(req);
    }

    return makeServiceRequest<CreateFolderJsonResponse>('CreateFolder', req, options);
}
