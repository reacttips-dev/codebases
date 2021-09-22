import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type UpdateItemJsonRequest from '../contract/UpdateItemJsonRequest';
import type UpdateItemJsonResponse from '../contract/UpdateItemJsonResponse';
import updateItemJsonRequest from '../factory/updateItemJsonRequest';

export default function updateItemOperation(
    req: UpdateItemJsonRequest,
    options?: RequestOptions
): Promise<UpdateItemJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = updateItemJsonRequest(req);
    }

    return makeServiceRequest<UpdateItemJsonResponse>('UpdateItem', req, options);
}
