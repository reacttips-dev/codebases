import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetItemJsonRequest from '../contract/GetItemJsonRequest';
import type GetItemJsonResponse from '../contract/GetItemJsonResponse';
import getItemJsonRequest from '../factory/getItemJsonRequest';

export default function getItemOperation(
    req: GetItemJsonRequest,
    options?: RequestOptions
): Promise<GetItemJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getItemJsonRequest(req);
    }

    return makeServiceRequest<GetItemJsonResponse>('GetItem', req, options);
}
