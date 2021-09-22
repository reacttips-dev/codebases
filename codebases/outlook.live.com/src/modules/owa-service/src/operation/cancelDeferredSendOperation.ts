import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type CancelDeferredSendRequest from '../contract/CancelDeferredSendRequest';
import cancelDeferredSendRequest from '../factory/cancelDeferredSendRequest';

export default function cancelDeferredSendOperation(
    req: CancelDeferredSendRequest,
    options?: RequestOptions
): Promise<boolean> {
    if (req !== undefined && !req['__type']) {
        req = cancelDeferredSendRequest(req);
    }

    return makeServiceRequest<boolean>('CancelDeferredSend', req, options);
}
