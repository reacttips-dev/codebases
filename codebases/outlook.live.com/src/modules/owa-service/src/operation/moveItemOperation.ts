import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type MoveItemJsonRequest from '../contract/MoveItemJsonRequest';
import type MoveItemJsonResponse from '../contract/MoveItemJsonResponse';
import moveItemJsonRequest from '../factory/moveItemJsonRequest';

export default function moveItemOperation(
    req: MoveItemJsonRequest,
    options?: RequestOptions
): Promise<MoveItemJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = moveItemJsonRequest(req);
    }

    return makeServiceRequest<MoveItemJsonResponse>('MoveItem', req, options);
}
