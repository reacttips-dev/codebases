import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type DeleteItemJsonRequest from '../contract/DeleteItemJsonRequest';
import type DeleteItemJsonResponse from '../contract/DeleteItemJsonResponse';
import deleteItemJsonRequest from '../factory/deleteItemJsonRequest';

export default function deleteItemOperation(
    req: DeleteItemJsonRequest,
    options?: RequestOptions
): Promise<DeleteItemJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = deleteItemJsonRequest(req);
    }

    return makeServiceRequest<DeleteItemJsonResponse>('DeleteItem', req, options);
}
