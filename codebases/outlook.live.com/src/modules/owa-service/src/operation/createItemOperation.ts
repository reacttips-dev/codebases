import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type CreateItemJsonRequest from '../contract/CreateItemJsonRequest';
import type CreateItemJsonResponse from '../contract/CreateItemJsonResponse';
import createItemJsonRequest from '../factory/createItemJsonRequest';

export default function createItemOperation(
    req: CreateItemJsonRequest,
    options?: RequestOptions
): Promise<CreateItemJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = createItemJsonRequest(req);
    }

    return makeServiceRequest<CreateItemJsonResponse>('CreateItem', req, options);
}
