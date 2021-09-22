import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type CopyItemJsonRequest from '../contract/CopyItemJsonRequest';
import type CopyItemJsonResponse from '../contract/CopyItemJsonResponse';
import copyItemJsonRequest from '../factory/copyItemJsonRequest';

export default function copyItemOperation(
    req: CopyItemJsonRequest,
    options?: RequestOptions
): Promise<CopyItemJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = copyItemJsonRequest(req);
    }

    return makeServiceRequest<CopyItemJsonResponse>('CopyItem', req, options);
}
