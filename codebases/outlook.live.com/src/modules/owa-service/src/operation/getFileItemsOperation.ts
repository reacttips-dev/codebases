import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetFileItemsJsonRequest from '../contract/GetFileItemsJsonRequest';
import type GetFileItemsJsonResponse from '../contract/GetFileItemsJsonResponse';
import getFileItemsJsonRequest from '../factory/getFileItemsJsonRequest';

export default function getFileItemsOperation(
    req: GetFileItemsJsonRequest,
    options?: RequestOptions
): Promise<GetFileItemsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getFileItemsJsonRequest(req);
    }

    return makeServiceRequest<GetFileItemsJsonResponse>('GetFileItems', req, options);
}
